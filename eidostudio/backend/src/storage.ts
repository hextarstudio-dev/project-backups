import { Env } from './db';

export interface StorageFile {
  key: string;
  size?: number;
  lastModified?: string;
  url?: string | null;
  etag?: string;
}

export interface StorageList {
  files: StorageFile[];
  folders: string[];
  prefix: string;
}

// Helper to generate a safe filename
const generateSafeFilename = (originalName: string): string => {
  const safeName = originalName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .toLowerCase();
  return safeName;
};

// Helper to validate folder path
const validateFolder = (folder: string): string => {
  const sanitized = folder
    .replace(/^\/+/, '')
    .replace(/(\.\.|\\)/g, '')
    .replace(/\s+/g, '');

  const allowedPrefixes = [
    "portfolio/projects",
    "portfolio/sections", 
    "eidoshub/products",
    "eidoshub/users",
    "services",
    "assets",
    "assets/logos",
    "assets/icons",
    "assets/site",
    "assets/site/logos",
    "assets/site/images",
    "assets/site/images/projects",
    "assets/site/images/services"
  ];

  const isAllowed = allowedPrefixes.some(prefix => 
    sanitized === prefix || sanitized.startsWith(`${prefix}/`)
  );

  return isAllowed ? sanitized : "assets";
};

// Upload file to R2
export async function uploadFile(
  env: Env,
  file: ArrayBuffer,
  filename: string,
  contentType: string,
  folder: string = 'assets'
): Promise<{ key: string; url: string }> {
  const validatedFolder = validateFolder(folder);
  const safeFilename = generateSafeFilename(filename);
  const key = `${validatedFolder}/${safeFilename}`;

  await env.R2.put(key, file, {
    httpMetadata: {
      contentType: contentType,
    },
  });

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  return { key, url };
}

// List files and folders in R2
export async function listStorage(
  env: Env,
  prefix: string = ''
): Promise<StorageList> {
  const result = await env.R2.list({
    prefix: prefix,
    limit: 1000
  });

  const files: StorageFile[] = [];
  const folders = new Set<string>();

  for (const object of result.objects) {
    const key = object.key;
    
    // Extract folder paths
    const parts = key.split('/');
    if (parts.length > 1) {
      const folderPath = parts.slice(0, -1).join('/');
      if (folderPath.startsWith(prefix) && folderPath !== prefix) {
        folders.add(folderPath + '/');
      }
    }

    files.push({
      key: object.key,
      size: object.size,
      lastModified: object.uploaded?.toISOString(),
      etag: object.etag,
      url: `${env.R2_PUBLIC_URL}/${object.key}`
    });
  }

  return {
    files: files.sort((a, b) => a.key.localeCompare(b.key)),
    folders: Array.from(folders).sort(),
    prefix
  };
}

// Delete file from R2
export async function deleteFile(env: Env, key: string): Promise<void> {
  await env.R2.delete(key);
}

// Delete folder (recursive)
export async function deleteFolder(env: Env, prefix: string): Promise<void> {
  if (!prefix.endsWith('/')) {
    prefix += '/';
  }

  const result = await env.R2.list({ prefix });
  
  for (const object of result.objects) {
    await env.R2.delete(object.key);
  }
}

// Setup storage structure
export async function setupStorageStructure(env: Env): Promise<string[]> {
  const logs: string[] = [];
  
  try {
    logs.push('[INIT] Setting up R2 storage structure...');

    const folders = [
      'portfolio/projects/',
      'portfolio/sections/',
      'eidoshub/products/',
      'eidoshub/users/',
      'services/',
      'assets/logos/',
      'assets/icons/',
      'assets/site/',
      'assets/site/logos/',
      'assets/site/images/',
      'assets/site/images/projects/',
      'assets/site/images/services/'
    ];

    for (const folder of folders) {
      // Create a placeholder file to ensure folder exists
      const placeholderKey = `${folder}.gitkeep`;
      await env.R2.put(placeholderKey, new TextEncoder().encode(''), {
        httpMetadata: {
          contentType: 'text/plain',
        },
      });
      logs.push(`[SUCCESS] Created folder: ${folder}`);
    }

    logs.push('[DONE] Storage structure setup complete!');
  } catch (error: any) {
    logs.push(`[ERROR] Failed to setup storage: ${error.message}`);
  }

  return logs;
}
