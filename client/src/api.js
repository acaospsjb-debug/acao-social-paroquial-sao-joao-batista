const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let authToken = '';

export function setAuthToken(token) {
  authToken = token || '';
}

export function clearAuthToken() {
  authToken = '';
}

export function getAuthToken() {
  return authToken;
}

export function whatsappLink(number, text = 'Olá! Gostaria de saber como apoiar a Ação Social Paroquial São João Batista.') {
  const clean = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${clean || '5547999999999'}?text=${encodeURIComponent(text)}`;
}

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Erro ao acessar a API.');
  return data;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('arquivo', file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: formData
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Erro ao enviar arquivo.');
  return data;
}
