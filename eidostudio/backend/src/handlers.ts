import { Env } from './db';
import { Project, Service, Category, ProjectSection, ProjectImage } from './types';
import { deleteFile } from './storage';
import { parsePaginationParams, getPaginationSQL } from './utils/pagination';
import { queryCache } from './utils/cache';

// Helper to create a JSON response with CORS headers

const toKey = (k: any): string | null => {
  if (!k || typeof k !== 'string') return null;
  const t = k.trim();
  return t.length ? t : null;
};

const collectProjectKeysFromPayload = (project: any): Set<string> => {
  const keys = new Set<string>();
  const cover = toKey(project.coverImageKey || project.cover_image_key);
  const card = toKey(project.cardImageKey || project.card_image_key);
  if (cover) keys.add(cover);
  if (card) keys.add(card);

  for (const section of (project.sections || [])) {
    for (const img of (section.images || [])) {
      const k = toKey(img.imageKey || img.image_key);
      if (k) keys.add(k);
    }
  }
  return keys;
};

const collectProjectKeysFromDb = async (db: any, projectId: string): Promise<Set<string>> => {
  const keys = new Set<string>();
  const p = await db.prepare('SELECT cover_image_key, card_image_key FROM projects WHERE id = ?').bind(projectId).first() as any;
  if (p?.cover_image_key) keys.add(p.cover_image_key);
  if (p?.card_image_key) keys.add(p.card_image_key);

  const imgs = await db.prepare(`
    SELECT pi.image_key
    FROM project_images pi
    JOIN project_sections ps ON ps.id = pi.section_id
    WHERE ps.project_id = ?
  `).bind(projectId).all();

  for (const row of (imgs.results as any[] || [])) {
    const k = toKey(row.image_key);
    if (k) keys.add(k);
  }
  return keys;
};

const safeDeleteKey = async (env: Env, key: string) => {
  try { await deleteFile(env, key); } catch (e) { console.warn('Failed to delete key from R2:', key); }
};

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // In production, you might want to restrict this
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export async function getProjects(request: Request, env: Env) {
  try {
    const db = env.DB;
    const url = new URL(request.url);
    const pagination = parsePaginationParams(url);

    // Wave 3: Check cache first
    const cacheKey = `projects:${url.searchParams.toString()}`;
    const cached = queryCache.get(cacheKey);
    if (cached) {
      return jsonResponse(cached);
    }

    // Wave 3: Use specific SELECT columns instead of SELECT *
    // 1. Fetch paginated projects, and ALL sections/images in parallel
    const [projectsRes, sectionsRes, imagesRes] = await Promise.all([
      db.prepare(`
        SELECT id, title, client, category_id, date, description,
               cover_image_url, card_image_url, cover_image_key, card_image_key, created_at
        FROM projects
        ORDER BY created_at DESC
        ${getPaginationSQL(pagination)}
      `).all(),
      db.prepare(`
        SELECT ps.id, ps.project_id, ps.type, ps.title, ps.content, ps.layout,
               ps.image_format, ps.slides_count, ps.colors, ps."order"
        FROM project_sections ps
        ORDER BY ps."order" ASC
      `).all(),
      db.prepare(`
        SELECT pi.id, pi.section_id, pi.url, pi.alt, pi.image_key, pi."order"
        FROM project_images pi
        ORDER BY pi."order" ASC
      `).all(),
    ]);

    const projects = projectsRes.results as unknown as Project[];
    const sections = sectionsRes.results as unknown as ProjectSection[];
    const images = imagesRes.results as unknown as ProjectImage[];

    // 2. Create maps for efficient lookups
    const sectionsMap = new Map<string, ProjectSection[]>();
    for (const section of sections) {
      if (!sectionsMap.has(section.project_id)) {
        sectionsMap.set(section.project_id, []);
      }
      section.images = []; // Initialize images array
      sectionsMap.get(section.project_id)?.push(section);
    }

    const imagesMap = new Map<string, ProjectImage[]>();
    for (const image of images) {
      if (!imagesMap.has(image.section_id)) {
        imagesMap.set(image.section_id, []);
      }
      imagesMap.get(image.section_id)?.push(image);
    }

    // 3. Assemble the nested structure
    const projectsList = (projectsRes.results || projectsRes) as any[];

    for (const project of projectsList) {
      project.sections = sectionsMap.get(project.id) || [];
      for (const section of project.sections) {
        section.images = imagesMap.get(section.id) || [];
      }

      // Compatibility mapping
      project.coverImageUrl = project.cover_image_url;
      project.cardImageUrl = project.card_image_url;
      project.coverImageKey = project.cover_image_key;
      project.cardImageKey = project.card_image_key;
      project.categoryId = project.category_id;
    }

    // Wave 3: Cache the result
    queryCache.set(cacheKey, projectsList);

    return jsonResponse(projectsList);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return jsonResponse({ error: 'Failed to fetch projects', details: error.message }, 500);
  }
}

export async function addProject(request: Request, env: Env) {
  try {
    const project: Project = await request.json();
    const db = env.DB;

    // 1. Inserir projeto
    await db.prepare(`
      INSERT INTO projects (id, title, client, category_id, date, description, cover_image_url, card_image_url, cover_image_key, card_image_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      project.id, project.title, project.client || '', project.category || project.category_id || '',
      project.date || '', project.description || '', project.coverImageUrl || project.cover_image_url || '',
      project.cardImageUrl || project.card_image_url || '', project.coverImageKey || project.cover_image_key || null,
      project.cardImageKey || project.card_image_key || null
    ).run();

    // 2. Inserir seções e imagens
    if (project.sections && project.sections.length > 0) {
      for (let i = 0; i < project.sections.length; i++) {
        const section = project.sections[i];
        await db.prepare(`
          INSERT INTO project_sections (id, project_id, type, title, content, layout, image_format, slides_count, colors, "order")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          section.id, project.id, section.type, section.title || '', section.content || '',
          section.layout || '', section.imageFormat || section.image_format || '',
          section.slidesCount || section.slides_count || 0,
          JSON.stringify(section.colors || []), i
        ).run();

        if (section.images && section.images.length > 0) {
          for (let j = 0; j < section.images.length; j++) {
            const img = section.images[j];
            const img_id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString() + Math.random().toString(36).substr(2, 9));
            await db.prepare(`
              INSERT INTO project_images (id, section_id, url, alt, image_key, "order")
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              img_id, section.id, img.url, img.alt || '',
              img.imageKey || img.image_key || null, j
            ).run();
          }
        }
      }
    }

    // Wave 3: Invalidate projects cache
    queryCache.invalidate('projects:');

    return jsonResponse({ success: true, id: project.id });
  } catch (error: any) {
    console.error('Error adding project:', error);
    return jsonResponse({ error: 'Failed to add project', details: error.message, stack: error.stack }, 500);
  }
}

export async function updateProject(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) return jsonResponse({ error: 'Missing project ID' }, 400);

    const project: Project = await request.json();
    const db = env.DB;
    const oldKeys = await collectProjectKeysFromDb(db, id);

    // 1. Atualizar projeto
    await db.prepare(`
      UPDATE projects 
      SET title = ?, client = ?, category_id = ?, date = ?, description = ?, 
          cover_image_url = ?, card_image_url = ?, cover_image_key = ?, card_image_key = ?
      WHERE id = ?
    `).bind(
      project.title, project.client || '', project.category || project.category_id || '',
      project.date || '', project.description || '', project.coverImageUrl || project.cover_image_url || '',
      project.cardImageUrl || project.card_image_url || '', project.coverImageKey || project.cover_image_key || null,
      project.cardImageKey || project.card_image_key || null, id
    ).run();

    // 2. Limpar seções antigas (cascade delete cuidará das imagens se estiver configurado)
    // Se não estiver em cascade no banco, precisamos limpar manualmente:
    const oldSections = await db.prepare('SELECT id FROM project_sections WHERE project_id = ?').bind(id).all();
    for (const sec of (oldSections.results as any[])) {
      await db.prepare('DELETE FROM project_images WHERE section_id = ?').bind(sec.id).run();
    }
    await db.prepare('DELETE FROM project_sections WHERE project_id = ?').bind(id).run();

    // 3. Re-inserir seções e imagens
    if (project.sections && project.sections.length > 0) {
      for (let i = 0; i < project.sections.length; i++) {
        const section = project.sections[i];
        await db.prepare(`
          INSERT INTO project_sections (id, project_id, type, title, content, layout, image_format, slides_count, colors, "order")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          section.id, id, section.type, section.title || '', section.content || '',
          section.layout || '', section.imageFormat || section.image_format || '',
          section.slidesCount || section.slides_count || 0,
          JSON.stringify(section.colors || []), i
        ).run();

        if (section.images && section.images.length > 0) {
          for (let j = 0; j < section.images.length; j++) {
            const img = section.images[j];
            const img_id = (typeof crypto !== 'undefined' && crypto.randomUUID)
              ? crypto.randomUUID()
              : (Date.now().toString() + Math.random().toString(36).substr(2, 9));
            await db.prepare(`
              INSERT INTO project_images (id, section_id, url, alt, image_key, "order")
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              img_id, section.id, img.url, img.alt || '',
              img.imageKey || img.image_key || null, j
            ).run();
          }
        }
      }
    }

    const newKeys = collectProjectKeysFromPayload(project);
    for (const oldKey of oldKeys) {
      if (!newKeys.has(oldKey)) await safeDeleteKey(env, oldKey);
    }

    // Wave 3: Invalidate projects cache
    queryCache.invalidate('projects:');

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return jsonResponse({ error: 'Failed to update project', details: error.message, stack: error.stack }, 500);
  }
}

export async function deleteProject(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) return jsonResponse({ error: 'Missing project ID' }, 400);

    const db = env.DB;
    const oldKeys = await collectProjectKeysFromDb(db, id);
    // DELETE em projects deve propagar para seções e imagens se configurado como ON DELETE CASCADE no schema.ts
    // No nosso schema.ts, está configurado como ON DELETE CASCADE.
    await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
    for (const key of oldKeys) await safeDeleteKey(env, key);

    // Wave 3: Invalidate projects cache
    queryCache.invalidate('projects:');

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return jsonResponse({ error: 'Failed to delete project', details: error.message }, 500);
  }
}

export async function getServices(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const pagination = parsePaginationParams(url);

    // Wave 3: Check cache
    const cacheKey = `services:${url.searchParams.toString()}`;
    const cached = queryCache.get(cacheKey);
    if (cached) {
      return jsonResponse(cached);
    }

    // Wave 3: Specific SELECT columns + pagination
    const { results } = await env.DB.prepare(`
      SELECT id, title, description, icon, image_url, image_key, items, created_at
      FROM services
      ORDER BY created_at ASC
      ${getPaginationSQL(pagination)}
    `).all();

    const services = (results as unknown as any[]).map(s => {
      let parsedItems = [];
      try {
        if (typeof s.items === 'string') {
          parsedItems = JSON.parse(s.items);
        } else if (Array.isArray(s.items)) {
          parsedItems = s.items;
        }
      } catch (e) {
        parsedItems = [];
      }
      return {
        ...s,
        items: parsedItems,
        desc: s.description,
        image: s.image_url,
        imageKey: s.image_key
      };
    });

    // Wave 3: Cache result
    queryCache.set(cacheKey, services);

    return jsonResponse(services as Service[]);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return jsonResponse({ error: 'Failed to fetch services', details: error.message }, 500);
  }
}

export async function addService(request: Request, env: Env) {
  try {
    const service: any = await request.json();
    const id = service.id || crypto.randomUUID();
    const itemsJson = JSON.stringify(service.items || []);

    await env.DB.prepare(`
      INSERT INTO services (id, title, description, icon, image_url, image_key, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, service.title, service.desc || '', service.icon || null,
      service.image || null, service.imageKey || null, itemsJson
    ).run();

    // Wave 3: Invalidate services cache
    queryCache.invalidate('services:');

    return jsonResponse({ success: true, id });
  } catch (error: any) {
    console.error('Error adding service:', error);
    return jsonResponse({ error: 'Failed to add service', details: error.message }, 500);
  }
}

export async function updateService(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) return jsonResponse({ error: 'Missing service ID' }, 400);

    const service: any = await request.json();
    const itemsJson = JSON.stringify(service.items || []);
    const oldSvc = await env.DB.prepare('SELECT image_key FROM services WHERE id = ?').bind(id).first() as any;

    await env.DB.prepare(`
      UPDATE services 
      SET title = ?, description = ?, icon = ?, image_url = ?, image_key = ?, items = ?
      WHERE id = ?
    `).bind(
      service.title, service.desc || '', service.icon || null,
      service.image || null, service.imageKey || null, itemsJson, id
    ).run();

    const oldKey = toKey(oldSvc?.image_key);
    const newKey = toKey(service.imageKey);
    if (oldKey && oldKey !== newKey) await safeDeleteKey(env, oldKey);

    // Wave 3: Invalidate services cache
    queryCache.invalidate('services:');

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return jsonResponse({ error: 'Failed to update service', details: error.message }, 500);
  }
}

export async function deleteService(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) return jsonResponse({ error: 'Missing service ID' }, 400);

    const oldSvc = await env.DB.prepare('SELECT image_key FROM services WHERE id = ?').bind(id).first() as any;
    await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    const oldKey = toKey(oldSvc?.image_key);
    if (oldKey) await safeDeleteKey(env, oldKey);

    // Wave 3: Invalidate services cache
    queryCache.invalidate('services:');

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return jsonResponse({ error: 'Failed to delete service', details: error.message }, 500);
  }
}

export async function getCategories(request: Request, env: Env) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM categories').all();
    return jsonResponse(results as unknown as Category[]);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return jsonResponse({ error: 'Failed to fetch categories', details: error.message }, 500);
  }
}


export async function addCategory(request: Request, env: Env) {
  try {
    const body = await request.json() as any;
    const name = (body?.name || '').trim();
    if (!name) return jsonResponse({ error: 'Category name is required' }, 400);

    const id = body?.id?.trim?.() || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await env.DB.prepare(`
      INSERT INTO categories (id, name)
      VALUES (?, ?)
    `).bind(id, name).run();

    return jsonResponse({ success: true, id, name }, 201);
  } catch (error: any) {
    console.error('Error adding category:', error);
    const msg = String(error?.message || '');
    if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
      return jsonResponse({ error: 'Category already exists' }, 409);
    }
    return jsonResponse({ error: 'Failed to add category', details: error.message }, 500);
  }
}
