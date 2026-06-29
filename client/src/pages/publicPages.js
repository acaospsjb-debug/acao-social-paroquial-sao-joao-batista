export const publicPages = [
  { key: 'inicio', path: '/', label: 'Início' },
  { key: 'sobre', path: '/sobre', label: 'Sobre' },
  { key: 'santa_dulce', path: '/projeto-santa-dulce', label: 'Santa Dulce' },
  { key: 'projetos', path: '/projetos', label: 'Projetos' },
  { key: 'doacao', path: '/doacao', label: 'Doação' },
  { key: 'parceiros', path: '/parceiros', label: 'Parceiros' },
  { key: 'noticias', path: '/noticias-eventos', label: 'Notícias' },
  { key: 'contato', path: '/contato', label: 'Contato' }
];

export function normalizeVisiblePages(value) {
  return publicPages.reduce((pages, page) => {
    pages[page.key] = value?.[page.key] ?? 1;
    return pages;
  }, {});
}

export function isPageVisible(config, key) {
  return Boolean(normalizeVisiblePages(config?.paginas_visiveis)[key]);
}
