import { env } from 'cloudflare:workers';
import { del } from '@vercel/blob';

function bucket(): R2Bucket {
  const images = (env as unknown as { IMAGES?: R2Bucket }).IMAGES;
  if (!images) throw new Error('Configure the IMAGES R2 binding');
  return images;
}
function isLegacyBlob(key: string) {
  try { const url = new URL(key); return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com'); }
  catch { return false; }
}
export async function putImage(path: string, body: Uint8Array | ArrayBuffer, contentType: string) {
  await bucket().put(path, new Uint8Array(body).slice(), { httpMetadata: { contentType } });
  return path;
}
export async function deleteImage(key: string) {
  if (isLegacyBlob(key)) {
    // Old images remain readable during migration. Delete only when its token is available.
    if (process.env.BLOB_READ_WRITE_TOKEN) await del(key);
    return;
  }
  await bucket().delete(key);
}
export async function getImage(key: string) {
  if (isLegacyBlob(key)) { const response = await fetch(key); return response.ok ? response : null; }
  const object = await bucket().get(key);
  if (!object) return null;
  const headers = new Headers(); object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}
