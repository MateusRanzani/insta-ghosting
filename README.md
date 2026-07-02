# Insta Ghosting

Descubra quem você segue no Instagram que não te segue de volta — e quem te segue e
você ainda não segue de volta. Sem login, sem scraping, **100% processado no seu
navegador**.

## Como funciona

1. Você exporta os seus próprios dados pelo canal oficial da Meta (Configurações →
   Central de Contas → Suas informações e permissões → Exportar informações)
2. Faz upload do `.zip` recebido aqui no app
3. O app extrai e compara as listas de seguidores/seguindo **localmente, no seu
   navegador** — nenhum arquivo ou dado é enviado a um servidor
4. Você vê o resultado em duas listas: quem não te segue de volta, e quem você não
   segue de volta

Não pedimos usuário ou senha do Instagram, e não fazemos nenhuma requisição
automatizada contra o Instagram (scraping). Veja mais em [CLAUDE.md](CLAUDE.md).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- [JSZip](https://stuk.github.io/jszip/) para extrair o `.zip` no navegador

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Pra testar o fluxo completo,
você precisa de um export real de dados do Instagram (categoria "Conexões", formato
JSON) — veja o tutorial dentro do próprio app.

Outros comandos:

```bash
npm run build   # build de produção
npm run lint    # lint
```

> ⚠️ Nunca commite um arquivo de exportação real do Instagram — ele contém usernames
> reais de terceiros. O `.gitignore` já bloqueia `*.zip`, mas fique atento se for
> testar com dados de verdade.

## Estrutura do projeto

```
app/                    # páginas (App Router)
components/             # componentes React (landing page, upload, resultado)
components/ui/          # componentes shadcn/ui
lib/                    # parsing do zip, comparação de listas, tipos — sem React
hooks/                  # hooks client-side (ex: perfis marcados como resolvidos)
specs/                  # spec de cada feature grande
```

## Specs

Cada feature grande tem uma spec em [`/specs`](specs). A atual:
[`001-comparador-seguidores.md`](specs/001-comparador-seguidores.md).

## Fora de escopo (por enquanto)

Login/autenticação, scraping, histórico entre exportações, backend/banco de dados e
monetização. Ver [CLAUDE.md](CLAUDE.md) para os princípios completos do produto.
