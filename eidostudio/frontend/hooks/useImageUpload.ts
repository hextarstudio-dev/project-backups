import { useState } from 'react';
import { authFetch } from '../utils/authFetch';

interface UploadResult {
  url: string;
  key: string;
}

interface UseImageUploadReturn {
  uploading: boolean;
  uploadFile: (file: File, folder: string) => Promise<UploadResult>;
}

/**
 * Custom hook for handling image uploads to R2/S3 storage
 * Provides unified upload functionality with loading state
 */
export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder: string): Promise<UploadResult> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const response = await authFetch(`/upload?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return { url: data.url, key: data.key };
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Erro ao fazer upload da imagem');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadFile,
  };
}
