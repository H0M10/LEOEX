// utils/uploadToCloudinary.js
// Sube una imagen (Blob o File) a Cloudinary usando tu preset unsigned

const CLOUD_NAME = 'dvjp9l0du';
const UPLOAD_PRESET = 'HANOMX';

export async function uploadToCloudinary(blobOrFile) {
  const form = new FormData();
  form.append('file', blobOrFile);
  form.append('upload_preset', UPLOAD_PRESET);
  const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form
  });
  if (!resp.ok) throw new Error('Upload failed');
  return resp.json(); // contiene secure_url, public_id, etc.
}
