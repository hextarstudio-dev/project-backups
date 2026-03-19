import { Env } from './db';
import { listStorage, deleteFile, deleteFolder, setupStorageStructure } from './storage';

// Helper to create a JSON response with CORS headers
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

// List storage contents
export async function getStorage(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || '';

    const result = await listStorage(env, prefix);
    return jsonResponse(result);
  } catch (error: any) {
    console.error('Error listing storage:', error);
    return jsonResponse({ error: 'Failed to list storage', details: error.message }, 500);
  }
}

// Delete file from storage
export async function deleteStorageFile(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
      return jsonResponse({ error: 'Key parameter is required' }, 400);
    }

    await deleteFile(env, key);
    return jsonResponse({ success: true, message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return jsonResponse({ error: 'Failed to delete file', details: error.message }, 500);
  }
}

// Delete folder from storage
export async function deleteStorageFolder(request: Request, env: Env) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix');

    if (!prefix) {
      return jsonResponse({ error: 'Prefix parameter is required' }, 400);
    }

    await deleteFolder(env, prefix);
    return jsonResponse({ success: true, message: 'Folder deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting folder:', error);
    return jsonResponse({ error: 'Failed to delete folder', details: error.message }, 500);
  }
}

// Setup storage structure
export async function setupStorage(request: Request, env: Env) {
  try {
    const logs = await setupStorageStructure(env);
    
    return jsonResponse({
      success: true,
      logs,
      message: 'Storage setup completed'
    });
  } catch (error: any) {
    console.error('Error setting up storage:', error);
    return jsonResponse({ 
      success: false,
      error: 'Failed to setup storage', 
      details: error.message,
      logs: []
    }, 500);
  }
}
