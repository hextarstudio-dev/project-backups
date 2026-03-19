import { Env } from './db';
import { uploadFile } from './storage';
import { validateUploadedFile } from './utils/fileSignature';

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const folder = formData.get('folder') as string || '';

    // Verificar se é upload múltiplo ou único
    const files = formData.getAll('files') as unknown as File[];
    const singleFile = formData.get('file') as unknown as File;

    const filesToUpload = files.length > 0 ? files : (singleFile ? [singleFile] : []);

    if (filesToUpload.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const results = [];
    const errors = [];

    // Processar cada arquivo
    for (const file of filesToUpload) {
      try {
        // Wave 4: SVG removed for security (can contain scripts)
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: Invalid file type. Allowed: PNG, JPG, GIF, WebP`);
          continue;
        }

        // Validar tamanho (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          errors.push(`${file.name}: File too large. Maximum size is 10MB`);
          continue;
        }

        // Converter arquivo para ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Wave 4: Validate file signature (magic bytes)
        const validation = await validateUploadedFile(arrayBuffer, file.type);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        // Sanitizar nome do arquivo
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

        // Fazer upload para R2
        const result = await uploadFile(env, arrayBuffer, sanitizedName, file.type, folder || 'assets');

        results.push({
          success: true,
          filename: result.key,
          originalName: file.name,
          url: `${env.R2_PUBLIC_URL}/${result.key}`,
          size: file.size,
          type: file.type
        });

      } catch (error: any) {
        console.error(`Upload error for ${file.name}:`, error);
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: results.length > 0,
      uploaded: results,
      url: results.length === 1 ? results[0].url : undefined,
      key: results.length === 1 ? results[0].filename : undefined,
      errors: errors,
      total: filesToUpload.length,
      successful: results.length,
      failed: errors.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
