import type { JsonLdObject } from './jsonLd';

/**
 * Inserta datos estructurados en el documento.
 *
 * El contenido lo generamos nosotros a partir de la configuración del sitio,
 * nunca de entrada de usuario, y `JSON.stringify` escapa el resto.
 */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
