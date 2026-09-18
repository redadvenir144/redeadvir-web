'use client';

import { useFormState } from 'react-dom';
import {
  Panel,
  Field,
  TextInput,
  TextArea,
  SubmitButton,
  FormMessage,
} from '@/components/admin';
import type { ActionState } from '@/lib/admin/form';
import type { SettingsMap } from '@/lib/data/settings.repository';
import { saveSettingsAction } from './actions';

const INITIAL: ActionState = {};

export function SettingsForm({
  settings,
  defaults,
}: {
  settings: SettingsMap;
  /** Valores de site.ts que se usan cuando el campo queda vacío. */
  defaults: SettingsMap;
}) {
  const [state, formAction] = useFormState(saveSettingsAction, INITIAL);

  return (
    <form action={formAction}>
      <div className="mb-4 flex flex-col gap-3">
        <FormMessage message={state.error} tone="error" />
        <FormMessage message={state.success} tone="success" />
      </div>

      <Panel
        title="Transmissão ao vivo"
        description="Mexer aqui afeta o player da página inicial."
      >
        <Field
          label="Endereço da transmissão (.m3u8)"
          name="stream_url"
          hint={`Deixe vazio para usar o endereço configurado no servidor. Atual: ${defaults.stream_url || 'não definido'}`}
        >
          <TextInput
            name="stream_url"
            defaultValue={settings.stream_url}
            placeholder={defaults.stream_url}
          />
        </Field>
      </Panel>

      <Panel title="Identidade do canal">
        <div className="flex flex-col gap-4">
          <Field
            label="Lema"
            name="site_tagline"
            hint={`Padrão: ${defaults.site_tagline ?? ''}`}
          >
            <TextInput
              name="site_tagline"
              defaultValue={settings.site_tagline}
              placeholder={defaults.site_tagline}
            />
          </Field>

          <Field
            label="Descrição do site"
            name="site_description"
            hint="Aparece no Google e nas redes sociais."
          >
            <TextArea
              name="site_description"
              rows={3}
              defaultValue={settings.site_description}
              placeholder={defaults.site_description}
            />
          </Field>

          <Field label="Versículo do rodapé" name="site_verse">
            <TextArea
              name="site_verse"
              rows={2}
              defaultValue={settings.site_verse}
              placeholder={defaults.site_verse}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Satélite">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Operadora" name="satellite_provider">
            <TextInput
              name="satellite_provider"
              defaultValue={settings.satellite_provider}
              placeholder={defaults.satellite_provider}
            />
          </Field>
          <Field label="Canal" name="satellite_channel">
            <TextInput
              name="satellite_channel"
              defaultValue={settings.satellite_channel}
              placeholder={defaults.satellite_channel}
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Redes sociais"
        description="Deixe vazio para esconder o ícone no rodapé."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Facebook" name="social_facebook">
            <TextInput
              name="social_facebook"
              defaultValue={settings.social_facebook}
              placeholder="https://facebook.com/…"
            />
          </Field>
          <Field label="Instagram" name="social_instagram">
            <TextInput
              name="social_instagram"
              defaultValue={settings.social_instagram}
              placeholder="https://instagram.com/…"
            />
          </Field>
          <Field label="YouTube" name="social_youtube">
            <TextInput
              name="social_youtube"
              defaultValue={settings.social_youtube}
              placeholder="https://youtube.com/…"
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Aplicativos e contato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="App Android (Google Play)" name="app_android">
            <TextInput
              name="app_android"
              defaultValue={settings.app_android}
              placeholder={defaults.app_android}
            />
          </Field>
          <Field label="App iOS (App Store)" name="app_ios">
            <TextInput
              name="app_ios"
              defaultValue={settings.app_ios}
              placeholder={defaults.app_ios}
            />
          </Field>
          <Field label="E-mail de contato" name="contact_email">
            <TextInput
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
              placeholder={defaults.contact_email}
            />
          </Field>
          <Field label="WhatsApp" name="contact_whatsapp">
            <TextInput
              name="contact_whatsapp"
              defaultValue={settings.contact_whatsapp}
              placeholder="+55 11 99999-9999"
            />
          </Field>
        </div>
      </Panel>

      <div className="sticky bottom-4">
        <SubmitButton>Salvar configuração</SubmitButton>
      </div>
    </form>
  );
}
