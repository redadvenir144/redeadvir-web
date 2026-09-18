# Painel administrativo

Painel próprio em `/admin`, dentro da mesma aplicação Next.js — mesma abordagem
da Red ADvenir (`redadvenir.org`), que também roda Next.js com `/admin` e
`/admin/login` próprios, sem CMS de terceiros.

## Como colocar no ar

### 1. Criar o banco de dados

Qualquer Postgres gerenciado serve. [Neon](https://neon.tech) e
[Supabase](https://supabase.com) têm plano gratuito de sobra para este volume.

Copie a connection string e coloque em `.env.local`:

```
DATABASE_URL=postgres://user:senha@host/banco?sslmode=require
```

`DATABASE_URL` é variável de **servidor**. Nunca use o prefixo `NEXT_PUBLIC_`
nela: isso exporia a senha do banco no navegador.

Em produção, cadastre a mesma variável nas *Environment Variables* do projeto
na Vercel.

### 2. Criar as tabelas e popular

```bash
npm run db:setup
```

Cria o esquema e copia o conteúdo de `src/mocks/` para o banco. É idempotente:
rodar de novo não duplica nada. Para recomeçar do zero:

```bash
npm run db:setup -- --reset
```

### 3. Criar o primeiro usuário

```bash
npm run db:admin -- seu@email.com suaSenhaForte Seu Nome
```

Esse usuário nasce com permissão de administrador. A partir daí, os demais se
cadastram pela própria tela `/admin/usuarios`.

## O que dá para editar

| Seção | O que controla |
|---|---|
| **Programas** | Catálogo de programas. Alimenta `/programas` e a grade. |
| **Grade** | Programação **por dia da semana**. Um dia pode ser copiado sobre os outros. |
| **Vídeos** | Catálogo de `/videos`. Rascunho x publicado. |
| **Páginas** | Textos livres publicados em `/<endereço>`, como `/privacidade` e `/termos`. |
| **Configuração** | Endereço da transmissão, lema, versículo, satélite, redes sociais, apps, contato. |
| **Usuários** | Quem entra e com qual permissão. Só administradores veem esta seção. |

Campos vazios em **Configuração** caem no valor padrão de
`src/lib/config/site.ts`, mostrado em cinza no formulário.

## Permissões

- **Editor** — mexe em todo o conteúdo.
- **Administrador** — o mesmo, mais o gerenciamento de usuários.

Salvaguardas embutidas: ninguém exclui a própria conta, e o sistema não deixa
ficar sem nenhum administrador. Trocar a senha de alguém encerra as sessões
abertas dessa pessoa.

## Como a segurança funciona

- Senhas com `scrypt` do `node:crypto` (sem dependência nativa extra).
- Sessão como identificador aleatório de 256 bits guardado no banco — não é um
  JWT, justamente para poder revogar um acesso na hora.
- Cookie `httpOnly`, `sameSite=lax`, `secure` em produção, validade de 7 dias.
- Três camadas de proteção: o `middleware.ts` redireciona cedo quem não tem
  cookie, o layout de `(painel)` valida a sessão contra o banco, e **cada
  Server Action chama `requireUser()` de novo** — porque Server Actions são
  endpoints HTTP próprios e não passam pelo layout.
- O login responde a mesma mensagem para e-mail inexistente e senha errada, e
  gasta o mesmo tempo nos dois casos, para não revelar quais e-mails existem.
- `/admin` é sempre `noindex`.

## Se o banco cair

O site público **não cai junto**. Os repositórios degradam para os dados de
`src/mocks/`, com um disjuntor que evita esperar o timeout de conexão em cada
consulta — sem ele, uma página com oito consultas levava 47 segundos; com ele,
1 segundo. Passados 30 segundos o sistema tenta o banco de novo sozinho.

O painel, ao contrário, falha de forma visível: quem está editando precisa
saber que a alteração não foi salva.

Sem `DATABASE_URL` definida, o site inteiro funciona normalmente com os dados
de `src/mocks/` — só o painel fica indisponível.
