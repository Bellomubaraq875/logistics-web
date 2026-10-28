export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'logistics_token';

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY));
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api<T = any>(path: string, opts: { method?: string; body?: any; form?: FormData } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  const res = await fetch(`${API_URL}${path}`, { method: opts.method || 'GET', headers, body });
  if (res.status === 401 && !path.startsWith('/auth/login')) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data as T;
}

export const fileUrl = (p: string) => (p.startsWith('http') ? p : `${API_URL}${p}`);

export const naira = (n: number | string) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(Number(n));

export const fmtDate = (d: string) => new Date(d).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
export const today = () => new Date().toISOString().slice(0, 10);

export type Position = { lat: number; lng: number; accuracy: number };
export function getPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation is not supported on this device'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => reject(new Error(e.code === 1 ? 'Location permission denied. Please allow location access.' : 'Could not get your location. Try again.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

export const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending', ACCEPTED: 'Accepted', PICKED_UP: 'Picked Up', IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered', FAILED: 'Failed', RETURNED: 'Returned',
};
export const mapLink = (lat: number, lng: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
