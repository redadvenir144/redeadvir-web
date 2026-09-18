import type { Page } from '@/types/content';

/**
 * MOCK: páginas de texto de ejemplo.
 * Se usa solo cuando no hay DATABASE_URL. El contenido real se edita
 * desde /admin/paginas.
 *
 * TODO: el texto definitivo de Política de Privacidade y Termos de Uso lo
 * tiene que aportar el cliente. Lo de aquí es un andamio, no texto legal.
 */
export const pages: Page[] = [
  {
    slug: 'privacidade',
    title: 'Política de Privacidade',
    description:
      'Como a REDE ADVIR trata os dados de quem visita o site e assiste à programação.',
    body: [
      'Esta página está sendo preparada.',
      '',
      'A REDE ADVIR não coleta dados pessoais de quem assiste à transmissão ao vivo neste site. Não há cadastro, login nem formulários de contato que guardem informações.',
      '',
      'Para dúvidas sobre privacidade, entre em contato pelos canais indicados no rodapé.',
    ].join('\n'),
    updatedAt: '2026-01-01T00:00:00-03:00',
  },
  {
    slug: 'termos',
    title: 'Termos de Uso',
    description:
      'Condições de uso do site e da transmissão ao vivo da REDE ADVIR.',
    body: [
      'Esta página está sendo preparada.',
      '',
      'O conteúdo da REDE ADVIR é oferecido gratuitamente para edificação espiritual. A reprodução do conteúdo para fins comerciais não é autorizada.',
      '',
      'Para dúvidas sobre o uso do conteúdo, entre em contato pelos canais indicados no rodapé.',
    ].join('\n'),
    updatedAt: '2026-01-01T00:00:00-03:00',
  },
];
