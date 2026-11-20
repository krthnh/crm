export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch(endpoint, options = {}) {
  const savedUser = sessionStorage.getItem('g6_usuario');
  const usuario = savedUser ? JSON.parse(savedUser) : null;

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(usuario ? { 'x-user-id': String(usuario.id) } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición al servidor');
  }

  return data;
}