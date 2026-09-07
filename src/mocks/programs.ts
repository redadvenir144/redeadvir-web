import type { Program, Category } from '@/types/content';

// Categorías base
const categories: Record<string, Category> = {
  devocional: { id: 'cat-1', name: 'Devocional', slug: 'devocional' },
  estudo: { id: 'cat-2', name: 'Estudo Bíblico', slug: 'estudo-biblico' },
  documentario: { id: 'cat-3', name: 'Documentário', slug: 'documentario' },
  musica: { id: 'cat-4', name: 'Música', slug: 'musica' },
  culinaria: { id: 'cat-5', name: 'Culinária', slug: 'culinaria' },
  infantil: { id: 'cat-6', name: 'Infantil', slug: 'infantil' },
  filme: { id: 'cat-7', name: 'Filme', slug: 'filme' },
};

export const programs: Program[] = [
  {
    id: 'prog-1',
    slug: 'fonte-de-agua-viva',
    title: 'Fonte de Água Viva',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Programa devocional diário com mensagens de esperança e reflexões bíblicas para começar o dia renovado espiritualmente.',
    category: categories.devocional,
    thumbnail: {
      src: '/images/programs/fonte-de-agua-viva.jpg',
      alt: 'Fonte de Água Viva',
      width: 640,
      height: 360,
    },
    durationMinutes: 30,
  },
  {
    id: 'prog-2',
    slug: 'momentos-de-paz',
    title: 'Momentos de Paz',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Um espaço de tranquilidade e meditação com músicas suaves e palavras de conforto para acalmar a alma.',
    category: categories.devocional,
    thumbnail: {
      src: '/images/programs/momentos-de-paz.jpg',
      alt: 'Momentos de Paz',
      width: 640,
      height: 360,
    },
    durationMinutes: 15,
  },
  {
    id: 'prog-3',
    slug: 'documentarios',
    title: 'Documentários',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Documentários inspiradores sobre natureza, história e ciência que revelam as maravilhas da criação divina.',
    category: categories.documentario,
    thumbnail: {
      src: '/images/programs/documentarios.jpg',
      alt: 'Documentários',
      width: 640,
      height: 360,
    },
    durationMinutes: 60,
  },
  {
    id: 'prog-4',
    slug: 'verdades-para-hoje',
    title: 'Verdades para Hoje',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Estudo bíblico profundo que explora as profecias e verdades das Escrituras aplicadas ao contexto atual.',
    category: categories.estudo,
    thumbnail: {
      src: '/images/programs/verdades-para-hoje.jpg',
      alt: 'Verdades para Hoje',
      width: 640,
      height: 360,
    },
    durationMinutes: 30,
  },
  {
    id: 'prog-5',
    slug: 'louvores-ao-rei',
    title: 'Louvores ao Rei',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Programa musical com hinos e louvores que elevam a alma em adoração ao Criador.',
    category: categories.musica,
    thumbnail: {
      src: '/images/programs/louvores-ao-rei.jpg',
      alt: 'Louvores ao Rei',
      width: 640,
      height: 360,
    },
    durationMinutes: 30,
  },
  {
    id: 'prog-6',
    slug: 'cozinha-saudavel',
    title: 'Cozinha Saudável',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Receitas nutritivas e saborosas baseadas nos princípios de saúde, com dicas práticas para o dia a dia.',
    category: categories.culinaria,
    thumbnail: {
      src: '/images/programs/cozinha-saudavel.jpg',
      alt: 'Cozinha Saudável',
      width: 640,
      height: 360,
    },
    durationMinutes: 30,
  },
  {
    id: 'prog-7',
    slug: 'criancas',
    title: 'Crianças',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Programação especial para os pequenos com histórias bíblicas, músicas e atividades educativas.',
    category: categories.infantil,
    thumbnail: {
      src: '/images/programs/criancas.jpg',
      alt: 'Crianças',
      width: 640,
      height: 360,
    },
    durationMinutes: 30,
  },
  {
    id: 'prog-8',
    slug: 'filmes',
    title: 'Filmes',
    // MOCK: descripción inventada, reemplazar con la real
    description:
      'Filmes e séries com valores cristãos que edificam e entretêm toda a família.',
    category: categories.filme,
    thumbnail: {
      src: '/images/programs/filmes.jpg',
      alt: 'Filmes',
      width: 640,
      height: 360,
    },
    durationMinutes: 120,
  },
];
