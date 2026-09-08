import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { SITE_NAME, DONATION_INFO } from '@/lib/config/site';

export const metadata: Metadata = {
  title: `Doar | ${SITE_NAME}`,
  description:
    'Apoie a missão da REDE ADVIR. Doe online via PayPal, cartão de crédito ou transferência bancária.',
  openGraph: {
    title: `Doar | ${SITE_NAME}`,
    description: 'Apoie a missão da REDE ADVIR com sua doação.',
    type: 'website',
  },
};

function HeartIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .759-.65h6.264c2.067 0 3.553.41 4.412 1.218.819.771 1.123 1.877.903 3.289-.02.127-.043.257-.068.39l-.007.038v.03c-.361 2.011-1.203 3.377-2.5 4.058-1.237.649-2.841.798-4.919.798H8.402a.792.792 0 0 0-.78.66L7.076 21.337zM19.077 8.26l-.004.02c-.014.083-.03.168-.047.254-.636 3.304-2.818 4.448-5.608 4.448h-1.42a.695.695 0 0 0-.686.59l-.727 4.59-.206 1.3a.369.369 0 0 0 .364.424h2.56a.677.677 0 0 0 .67-.578l.028-.14.53-3.345.034-.186a.677.677 0 0 1 .67-.578h.42c2.728 0 4.863-1.107 5.487-4.31.26-1.337.126-2.453-.564-3.238-.208-.237-.467-.439-.772-.612a6.51 6.51 0 0 1-.529-.239z" />
    </svg>
  );
}

export default function DoarPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Hero */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-600/20 text-brand-400 mb-6">
          <HeartIcon />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Apoie Nossa Missão
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Sua doação ajuda a levar a mensagem de esperança do evangelho a milhões de lares
          através da {SITE_NAME}.
        </p>
      </header>

      {/* Doação Online */}
      <section className="mb-8">
        <Card padding="lg" hover>
          <div className="flex items-start gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-600/20 text-brand-400 shrink-0">
              <CreditCardIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Doação Online (Cartão ou PayPal)
              </h2>
              <p className="text-text-secondary">
                Doe de forma segura com cartão de crédito, débito ou conta PayPal.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={DONATION_INFO.paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'inline-flex items-center justify-center gap-2',
                'px-8 py-4 bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold rounded-xl',
                'transition-colors text-lg',
              ].join(' ')}
            >
              <PayPalIcon />
              Doar com PayPal
            </a>
            <p className="text-sm text-text-muted self-center">
              Você também pode pagar com cartão de crédito ou débito, sem precisar ter conta PayPal.
            </p>
          </div>

          <p className="mt-6 text-sm text-text-muted bg-tv-elevated rounded-lg p-4">
            As empresas de cartão e PayPal cobram até 3% do valor. Para que o valor
            completo seja doado, considere transferência bancária ou cheque.
          </p>
        </Card>
      </section>

      {/* Transferência Bancária */}
      <section className="mb-8">
        <Card padding="lg" hover>
          <div className="flex items-start gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-600/20 text-brand-400 shrink-0">
              <BankIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Transferência Bancária / Cheque
              </h2>
              <p className="text-text-secondary">
                Envie sua doação diretamente para Gospel Ministries International.
              </p>
            </div>
          </div>

          <div className="bg-tv-elevated rounded-lg p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-text-muted mb-1">Beneficiário</dt>
                <dd className="text-white font-semibold">{DONATION_INFO.organization}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted mb-1">Endereço</dt>
                <dd className="text-white">{DONATION_INFO.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted mb-1">Observação</dt>
                <dd className="text-brand-400 font-medium">
                  Indique &quot;REDE ADVIR&quot; no campo de observações
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 text-sm text-text-muted">
            Para dados bancários específicos (routing number, account number),
            entre em contato com a equipe de doações.
          </p>
        </Card>
      </section>

      {/* Contato */}
      <section className="mb-12">
        <Card padding="lg" hover>
          <div className="flex items-start gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-600/20 text-brand-400 shrink-0">
              <EnvelopeIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Dúvidas sobre Doações?
              </h2>
              <p className="text-text-secondary">
                Entre em contato com nossa equipe de doações.
              </p>
            </div>
          </div>

          <a
            href={`mailto:${DONATION_INFO.email}`}
            className={[
              'inline-flex items-center gap-2',
              'px-6 py-3 bg-tv-elevated hover:bg-tv-hover border border-tv-border text-white rounded-xl',
              'transition-colors',
            ].join(' ')}
          >
            <EnvelopeIcon />
            {DONATION_INFO.email}
          </a>
        </Card>
      </section>

      {/* Sobre GMI */}
      <section className="text-center">
        <Card padding="lg" className="bg-gradient-to-r from-brand-700 to-brand-600 border-none">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sobre {DONATION_INFO.organization}
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            A {SITE_NAME} faz parte da {DONATION_INFO.organization}, uma organização
            sem fins lucrativos dedicada a compartilhar o evangelho e a esperança
            do breve retorno de Jesus Cristo em todo o mundo.
          </p>
          <a
            href={DONATION_INFO.organizationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-white text-brand-700 font-bold rounded-xl',
              'hover:bg-white/90 transition-colors',
            ].join(' ')}
          >
            Conhecer GMI
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </Card>
      </section>

      {/* Voltar */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-text-muted hover:text-white transition-colors"
        >
          &larr; Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}
