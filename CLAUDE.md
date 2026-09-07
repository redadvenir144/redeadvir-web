# REDE ADVIR — Plataforma Web

## Contexto

Canal de televisión cristiano adventista de Brasil, perteneciente a Gospel
Ministries International (GMI). Lema: "O canal da volta de Jesus".
Emite 24/7 por satélite (Vivensis canal 7777) e internet.
Sitio actual a reemplazar: redeadvir.net.br

- **Idioma de toda la interfaz y el contenido: portugués de Brasil (pt-BR).**
  Nunca generes UI en español ni en inglés. Todo texto visible —botones, estados,
  mensajes de error, etiquetas— va en pt-BR.
- La marca del canal usa "AO VIVO", nunca "EN VIVO" ni "LIVE".
- Audiencia mayoritariamente móvil y con proporción alta de adultos mayores.
  Diseña primero para 360px y prioriza legibilidad sobre densidad.
- El producto principal es **la transmisión en vivo**. Toda decisión de UX se juzga
  por si acerca o aleja al usuario del directo.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS

## Comandos

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit    # ejecutar SIEMPRE antes de dar una tarea por terminada
```

## Arquitectura

Organización por dominio funcional, no por tipo de archivo:

```
src/
├── app/(site)/          # rutas
├── features/            # live/ schedule/ programs/ news/  (lógica + UI + tipos del dominio)
├── components/ui/       # primitivos sin lógica de negocio
├── components/layout/   # Header, Nav, MobileMenu, Footer
├── lib/data/            # interfaces de repositorio (contrato público)
├── lib/adapters/        # mock/ · wordpress/   (implementaciones intercambiables)
├── lib/seo/             # metadata + JSON-LD
├── types/
└── mocks/               # datos crudos, nunca importados por un componente
```

### Regla central de datos

**Ningún componente hace `fetch`.** Los componentes consumen repositorios de
`lib/data/`. Los repositorios delegan en un adaptador. Hoy el adaptador activo es
`mock`; más adelante será WordPress headless. Cambiar de fuente debe requerir
tocar un solo archivo.

Si necesitas un dato que no está en un repositorio, **añade el método a la
interfaz primero** y luego impleméntalo en el adaptador mock.

### Fechas

Viajan siempre como string ISO 8601 **con offset**, nunca como objeto `Date`.
Razón: `Date` no serializa limpio entre Server y Client Components, y la grilla
depende de zona horaria explícita.

## Reglas no negociables

1. **No inventes endpoints, URLs de streaming, credenciales ni APIs.** Si falta un
   dato, deja `TODO:` con el contrato tipado y usa mock.
2. **No agregues dependencias sin justificar** qué problema resuelven, por qué no
   se hace a mano y qué cuestan en bundle. Excepción ya aprobada: `hls.js`.
3. **Nada de `any`.** Si un tipo es difícil, dilo en vez de silenciarlo.
4. **Toda función que puede fallar maneja el fallo.** Sin excepción en red y vídeo.
5. **El usuario nunca ve un error técnico.** Nada de `MEDIA_ERR_DECODE`, códigos
   HTTP ni stack traces en pantalla. Esos van a consola/monitorización.
6. **Secretos solo en `.env.local`.** Distingue `NEXT_PUBLIC_*` de variables de
   servidor. Nunca expongas una clave en un Client Component.
7. **No reescribas código existente que funciona** porque exista otra forma de
   hacerlo. Primero evalúa la modificación mínima.
8. **Preguntas antes de decisiones arquitectónicas.** Si falta información crítica,
   pregunta. Si falta información menor, decide y explica en una línea.

## Prioridad cuando hay conflicto

UX → Funcionalidad → Mantenibilidad → Performance → Seguridad → SEO

No sacrifiques la experiencia por elegancia técnica, ni la arquitectura por
hacer que algo funcione rápido.

## Reproductor en vivo — estados obligatorios

Toda implementación del player debe cubrir explícitamente:

| Estado | Comportamiento |
|---|---|
| `loading` | Póster + spinner. Timeout a 15s → `error` |
| `live` | Vídeo + badge rojo **AO VIVO** con texto, no solo color |
| `offline` | Póster + "Estamos fora do ar neste momento" + grade do dia. Reintento cada 30s |
| `networkError` | "Verifique sua conexão com a internet" + botón "Tentar novamente". Backoff 2/4/8/16s, máx 5 |
| `serverError` | "Estamos com uma instabilidade técnica" + botón + enlace a la app |
| `unsupported` | Detección previa de HLS/MSE → enlaces a las apps nativas |
| `buffering` | Overlay translúcido, sin ocultar el vídeo |

**Nunca pantalla negra.** Si el directo cae, el sitio muestra la programación del
día y contenido grabado. El usuario vino a consumir contenido; dale contenido.

## Accesibilidad

- HTML semántico antes que ARIA. ARIA solo cuando sea necesario.
- `aria-label` obligatorio en todo enlace o botón cuyo contenido sea solo un icono.
- Nunca `user-scalable=no` ni `maximum-scale`. El zoom debe funcionar siempre.
- Áreas táctiles mínimo 44×44px.
- Respeta `prefers-reduced-motion` en cualquier animación.
- Contraste mínimo AA (4.5:1 en texto normal).

## SEO

- `generateMetadata` en toda ruta. **Nunca** description duplicada entre páginas.
- `og:image` 1200×630. Twitter Cards presentes.
- JSON-LD: `Organization` + `TelevisionStation` en el layout raíz;
  `VideoObject` en el directo; `TVSeries` en cada programa.
- Contenido importante renderizado en servidor, no solo en cliente.

## Convenciones de código

- Server Components por defecto. `"use client"` solo cuando haya estado,
  efectos o APIs del navegador — y lo más abajo posible en el árbol.
- Componentes en PascalCase, un componente por archivo.
- Si un componente pasa de ~150 líneas o acumula responsabilidades, divídelo.
- `next/image` siempre, con `width` y `height` o `fill`. Nunca `<img>` suelto.
- Sin `localStorage`/`sessionStorage` en el primer alcance del proyecto.

## Qué NO construir

Estos elementos existen en el sitio actual y **no se migran**:

- Contador público de visitas ("2 Online / 168398 Visitas") — perjudica credibilidad.
- "Peça sua música" — es funcionalidad de radio heredada de la plantilla, no de TV.
- Carrusel decorativo sin CTA en la portada — el hero es el reproductor.
- "Bate-papo" (chat) — no hasta que exista audiencia y moderación.

## Navegación definitiva

Solo 5 elementos: **AO VIVO** (destacado) · Programação · Programas · Vídeos · Sobre

Notícias, Podcasts, Fotos, Eventos y Equipe quedan fuera hasta que tengan
contenido real. En el sitio actual devuelven "Nenhum registro encontrado".

## Estado actual del proyecto

Fase: fundación. Sin backend conectado. Todo dato viene de `mocks/`.

Pendiente de confirmar con el cliente (no asumir, no inventar):
- URL `.m3u8` real. Hoy el vídeo es un iframe de `player.logicahost.com.br`.
  Si el CDN no permite CORS desde nuestro dominio, el player propio no es viable.
- Si la programación varía por día o es idéntica los 7 días (hoy es idéntica).
- Dominio canónico: existe también redeadvir.org con contenido distinto.
- Logo en SVG con fondo transparente. El actual es un JPEG con fondo negro.
