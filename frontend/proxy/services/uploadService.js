import { CONFIG } from '../../constants/config';

export const uploadService = {
  async uploadPhoto(uri) {
    try {
      const form = new FormData();
      const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
      const ext = filename.split('.').pop();
      const type = ext ? `image/${ext}` : 'image/jpeg';

      form.append('photo', {
        uri,
        name: filename,
        type
      });

      const res = await fetch(`${CONFIG.API_BASE_URL}/upload/photo`, {
        method: 'POST',
        body: form,
        headers: {
          // Importante: no establecer manualmente Content-Type para FormData
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al subir foto');
      }
      const json = await res.json();
      return json?.data?.url || null;
    } catch (e) {
      console.error('uploadService.uploadPhoto error:', e);
      throw e;
    }
  }
};


