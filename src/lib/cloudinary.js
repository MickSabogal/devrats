// src/lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de imagem para Cloudinary
 * @param {string} base64Image - Imagem em formato base64
 * @param {string} folder - Pasta no Cloudinary (ex: 'avatars', 'posts', 'groups')
 * @param {string} publicId - ID público opcional (ex: userId para avatares)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(base64Image, folder = 'devrats', publicId = null) {
  try {
    const uploadOptions = {
      folder: `devrats/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Deletar imagem do Cloudinary
 * @param {string} publicId - ID público da imagem
 */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Não lançar erro - deletar imagem é operação não-crítica
  }
}

/**
 * Extrair public_id de uma URL do Cloudinary
 * @param {string} url - URL completa da imagem
 * @returns {string|null} - Public ID ou null
 */
export function extractPublicId(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Extrair o public_id da URL
    // Ex: https://res.cloudinary.com/demo/image/upload/v1234/devrats/avatars/user123.jpg
    // Retorna: devrats/avatars/user123
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    const afterUpload = parts[1].split('/').slice(1).join('/');
    return afterUpload.split('.')[0];
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

export default cloudinary;