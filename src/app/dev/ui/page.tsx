'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  LiveBadge,
  Skeleton,
  EmptyState,
  EmptySearchIcon,
  EmptyContentIcon,
  ErrorState,
  NetworkErrorIcon,
  GenericErrorIcon,
} from '@/components/ui';

function Section({
  title,
  children,
  dark = false,
}: {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={[
        'p-6 rounded-xl',
        dark ? 'bg-player-bg text-text-inverse' : 'bg-surface',
      ].join(' ')}
    >
      <h2
        className={[
          'text-xl font-semibold mb-6',
          dark ? 'text-text-inverse' : 'text-text-primary',
        ].join(' ')}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm text-text-muted mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function DevUIPage() {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-surface-subtle p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Sistema de Design — REDE ADVIR
          </h1>
          <p className="text-text-secondary">
            Revisão visual de componentes em fundo claro e escuro
          </p>
        </header>

        {/* ===== BUTTONS ===== */}
        <Section title="Button">
          <Subsection label="Variantes">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </Subsection>

          <Subsection label="Tamanhos">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg">Grande</Button>
          </Subsection>

          <Subsection label="Estados">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading={loading} onClick={handleLoadingClick}>
              {loading ? 'Carregando...' : 'Clique para loading'}
            </Button>
          </Subsection>

          <Subsection label="Secondary + Ghost estados">
            <Button variant="secondary" disabled>
              Secondary Disabled
            </Button>
            <Button variant="ghost" disabled>
              Ghost Disabled
            </Button>
          </Subsection>
        </Section>

        {/* ===== BUTTONS DARK ===== */}
        <Section title="Button (fundo escuro)" dark>
          <Subsection label="Variantes">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </Subsection>
        </Section>

        {/* ===== CARD ===== */}
        <Section title="Card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="sm">
              <p className="text-sm">Padding pequeno</p>
            </Card>
            <Card padding="md">
              <p>Padding médio (padrão)</p>
            </Card>
            <Card padding="lg">
              <p className="text-lg">Padding grande</p>
            </Card>
          </div>
        </Section>

        {/* ===== BADGES ===== */}
        <Section title="Badge">
          <Subsection label="Variantes">
            <Badge variant="default">Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="muted">Muted</Badge>
          </Subsection>
        </Section>

        {/* ===== LIVE BADGE ===== */}
        <Section title="LiveBadge">
          <Subsection label="Tamanhos (ponto pulsante)">
            <LiveBadge size="sm" />
            <LiveBadge size="md" />
          </Subsection>
          <p className="text-sm text-text-muted mt-4">
            O ponto respeita prefers-reduced-motion. Teste ativando essa
            preferência no sistema.
          </p>
        </Section>

        {/* ===== LIVE BADGE DARK ===== */}
        <Section title="LiveBadge (fundo escuro)" dark>
          <Subsection label="Visibilidade sobre fundo do player">
            <LiveBadge size="sm" />
            <LiveBadge size="md" />
          </Subsection>
        </Section>

        {/* ===== SKELETON ===== */}
        <Section title="Skeleton">
          <Subsection label="Variantes">
            <div className="w-full max-w-md space-y-3">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </div>
          </Subsection>

          <Subsection label="Formas">
            <Skeleton variant="rectangular" width="200px" height="120px" />
            <Skeleton variant="circular" width="48px" height="48px" />
          </Subsection>
        </Section>

        {/* ===== EMPTY STATE ===== */}
        <Section title="EmptyState">
          <Card>
            <EmptyState
              icon={<EmptySearchIcon />}
              title="Nenhum resultado encontrado"
              description="Tente buscar com outros termos ou navegue pela programação completa."
              action={<Button variant="primary">Ver programação</Button>}
            />
          </Card>

          <div className="mt-6">
            <Card>
              <EmptyState
                icon={<EmptyContentIcon />}
                title="Sem vídeos disponíveis"
                description="Novos vídeos serão adicionados em breve. Enquanto isso, assista ao vivo."
                action={<Button variant="primary">Assistir ao vivo</Button>}
              />
            </Card>
          </div>
        </Section>

        {/* ===== ERROR STATE ===== */}
        <Section title="ErrorState">
          <Card>
            <ErrorState
              icon={<NetworkErrorIcon />}
              title="Sem conexão com a internet"
              description="Verifique sua conexão e tente novamente."
              action={<Button variant="primary">Tentar novamente</Button>}
            />
          </Card>

          <div className="mt-6">
            <Card>
              <ErrorState
                icon={<GenericErrorIcon />}
                title="Algo deu errado"
                description="Estamos com uma instabilidade técnica. Tente novamente ou acesse pelo app."
                action={<Button variant="primary">Tentar novamente</Button>}
                secondaryAction={
                  <Button variant="ghost">Baixar o app</Button>
                }
              />
            </Card>
          </div>
        </Section>

        {/* ===== ERROR STATE DARK ===== */}
        <Section title="ErrorState (fundo escuro — contexto player)" dark>
          <div className="bg-player-bg border border-player-border rounded-lg p-6">
            <ErrorState
              icon={<NetworkErrorIcon />}
              title="Sem conexão com a internet"
              description="Verifique sua conexão e tente novamente."
              action={<Button variant="primary">Tentar novamente</Button>}
            />
          </div>
        </Section>

        {/* ===== COLOR PALETTE ===== */}
        <Section title="Paleta de Cores">
          <Subsection label="Brand (azul)">
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg bg-brand-${shade}`}
                      style={{
                        backgroundColor: `var(--tw-colors-brand-${shade}, hsl(0 0% 50%))`,
                      }}
                    />
                    <p className="text-xs mt-1">{shade}</p>
                  </div>
                )
              )}
            </div>
          </Subsection>

          <Subsection label="Live (rojo — EXCLUSIVO para AO VIVO)">
            <div className="flex gap-2">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-live-light" />
                <p className="text-xs mt-1">light</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-live" />
                <p className="text-xs mt-1">default</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-live-dark" />
                <p className="text-xs mt-1">dark</p>
              </div>
            </div>
          </Subsection>
        </Section>

        {/* ===== TOUCH TARGETS ===== */}
        <Section title="Áreas Táteis (mínimo 44×44px)">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button size="sm">Botão</Button>
              <div className="absolute inset-0 border-2 border-dashed border-brand-300 rounded-lg pointer-events-none" />
            </div>
            <p className="text-sm text-text-secondary">
              Todos os botões têm min-height e min-width de 44px (2.75rem)
            </p>
          </div>
        </Section>

        {/* ===== FOCUS STATES ===== */}
        <Section title="Estados de Foco">
          <p className="text-sm text-text-secondary mb-4">
            Use Tab para navegar e verificar o anel de foco visível (2px azul
            com offset)
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Foco 1</Button>
            <Button variant="secondary">Foco 2</Button>
            <Button variant="ghost">Foco 3</Button>
          </div>
        </Section>

        <footer className="text-center text-text-muted text-sm py-8">
          <p>REDE ADVIR — Sistema de Design v1.0</p>
        </footer>
      </div>
    </main>
  );
}
