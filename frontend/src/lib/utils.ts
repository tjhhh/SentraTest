import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseApiResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const isJson = contentType.includes('application/json');

  if (isJson) {
    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      if (text.trim().startsWith('<')) {
        throw new Error('Koneksi Database Gagal');
      }
      throw new Error('Gagal memproses respon server');
    }

    if (!response.ok) {
      throw new Error(json?.message || response.statusText || 'Request failed');
    }
    return json;
  }

  if (text.trim().startsWith('<')) {
    throw new Error('Koneksi Database Gagal');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Koneksi Database Gagal');
  }
}
