import { put, del } from '@vercel/blob';

export async function putImage(path:string, body:Uint8Array|ArrayBuffer, contentType:string) {
  const blob = await put(path, new Blob([new Uint8Array(body).slice()], {type:contentType}), {access:'public', addRandomSuffix:false});
  return blob.url;
}
export async function deleteImage(url:string) { await del(url); }
export async function getImage(url:string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response;
}
