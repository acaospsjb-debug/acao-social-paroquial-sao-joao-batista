const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const DONATION_URL = 'https://acaosocialparoquialsjb.doardigital.com.br/doacao';
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

export function findExternalLink(links = [], plataforma) {
  return links.find((link) => String(link.plataforma || '').toLowerCase() === String(plataforma || '').toLowerCase() && Number(link.ativo));
}

export function externalHref(link, fallback = '#') {
  return link?.url || fallback;
}

export function hasValidCnpj(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 14 && !/^0+$/.test(digits);
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
  if (data?.url && data.url.startsWith('/')) {
    data.url = `${API_URL}${data.url}`;
  }
  return data;
}
