import type { Video } from '@/types/content';

/**
 * MOCK: catálogo de vídeos de ejemplo.
 * Se usa solo cuando no hay DATABASE_URL. Los datos reales se editan
 * desde /admin/videos.
 */
export const videos: Video[] = [
  {
    id: 'vid-1',
    slug: 'sermao-a-esperanca-que-temos',
    title: 'Sermão: A Esperança que Temos',
    description: 'Uma mensagem sobre a esperança na volta de Jesus.',
    category: { id: 'cat-v1', slug: 'sermoes', name: 'Sermões' },
    url: '',
    thumbnail: null,
    durationSeconds: 2730,
    publishedAt: '2026-01-15T10:00:00-03:00',
  },
  {
    id: 'vid-2',
    slug: 'musica-hinos-de-louvor',
    title: 'Música: Hinos de Louvor',
    description: 'Seleção de hinos tradicionais adventistas.',
    category: { id: 'cat-v2', slug: 'musica', name: 'Música' },
    url: '',
    thumbnail: null,
    durationSeconds: 1935,
    publishedAt: '2026-01-14T10:00:00-03:00',
  },
  {
    id: 'vid-3',
    slug: 'estudo-biblico-apocalipse',
    title: 'Estudo Bíblico: Apocalipse',
    description: 'Estudo sobre as profecias do livro de Apocalipse.',
    category: { id: 'cat-v3', slug: 'estudos', name: 'Estudos' },
    url: '',
    thumbnail: null,
    durationSeconds: 3480,
    publishedAt: '2026-01-13T10:00:00-03:00',
  },
  {
    id: 'vid-4',
    slug: 'documentario-historia-da-igreja',
    title: 'Documentário: História da Igreja',
    description: 'A trajetória da igreja adventista no Brasil.',
    category: { id: 'cat-v4', slug: 'documentarios', name: 'Documentários' },
    url: '',
    thumbnail: null,
    durationSeconds: 4800,
    publishedAt: '2026-01-12T10:00:00-03:00',
  },
  {
    id: 'vid-5',
    slug: 'testemunho-uma-nova-vida',
    title: 'Testemunho: Uma Nova Vida',
    description: 'Testemunho de transformação pela fé.',
    category: { id: 'cat-v5', slug: 'testemunhos', name: 'Testemunhos' },
    url: '',
    thumbnail: null,
    durationSeconds: 1545,
    publishedAt: '2026-01-11T10:00:00-03:00',
  },
  {
    id: 'vid-6',
    slug: 'sermao-fe-e-perseveranca',
    title: 'Sermão: Fé e Perseverança',
    description: 'Mensagem sobre perseverar na fé em tempos difíceis.',
    category: { id: 'cat-v1', slug: 'sermoes', name: 'Sermões' },
    url: '',
    thumbnail: null,
    durationSeconds: 2520,
    publishedAt: '2026-01-10T10:00:00-03:00',
  },
];
