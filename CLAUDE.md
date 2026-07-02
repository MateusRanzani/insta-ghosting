# Contexto do Projeto

## O que é

App web que compara os arquivos de exportação de dados do Instagram (followers/following)
e mostra ao usuário: (1) quem ele segue e não é seguido de volta, (2) quem o segue e ele
não segue de volta. Todo o processamento acontece no navegador do usuário — nenhum dado
é enviado a um servidor.

## Princípios do produto (não negociáveis)

- **Sem login no Instagram.** Nunca pedimos usuário/senha do Instagram. O usuário exporta
  os próprios dados pelo canal oficial da Meta e faz upload aqui.
- **Sem scraping.** Não fazemos requisições automatizadas contra o Instagram. Isso viola os
  Termos de Serviço e arrisca o banimento da conta do usuário — está fora de escopo permanentemente.
- **Processamento 100% client-side.** O parsing do `.zip`/JSON acontece no navegador
  (JS puro), nunca em um backend. Isso é o diferencial de privacidade do produto e também
  o motivo de não termos custo de servidor no MVP.
- **Sem persistência de dados por enquanto.** MVP não tem conta de usuário, não salva
  histórico, não grava nada em banco. Se isso mudar no futuro, precisa de uma decisão
  explícita de arquitetura (ver seção "Fora de escopo do MVP").

## Stack

- **Frontend:** Next.js (App Router) + TypeScript
- **Estilo:** Tailwind CSS + shadcn/ui
- **Parsing de zip:** JSZip (client-side)
- **Backend:** nenhum no MVP. Se features futuras exigirem (histórico, contas), avaliar
  Python/FastAPI nesse momento — não antes.
- **Deploy:** Vercel (free tier)

## Identidade visual

- Gradiente inspirado no ícone do Instagram: `#833AB4 → #FD1D1D → #FCB045`, usado com
  moderação (logo, CTA principal) — não a página inteira.
- Tipografia clean tipo Inter.
- Cards de feature com ícone + título curto + descrição (estilo já validado com o usuário).
- Fundo suave com leve gradiente rosa/lilás no hero.
- Botões em formato pill (bem arredondados).

## Convenções de código

- Componentes em `PascalCase`, arquivos de componente `PascalCase.tsx`
- Lógica de parsing/comparação isolada em `/lib` (nunca dentro de componentes React)
- Sempre tipar os dados vindos do JSON do Instagram (ver tipos em `/lib/types.ts`)
- Commits seguem Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Sem `any` no TypeScript

## Comandos úteis

- `npm run dev` — inicia servidor local
- `npm run build` — build de produção
- `npm run lint` — lint

## Specs

Cada feature grande tem um arquivo em `/specs`. Ao pedir implementação, referencie o
arquivo da spec (ex: "implemente a spec em `/specs/001-comparador-seguidores.md`").

## Fora de escopo do MVP

- Login/autenticação
- Scraping ou qualquer chamada automatizada ao Instagram
- Histórico entre exportações / comparação ao longo do tempo
- Backend/banco de dados
- Monetização (anúncios, assinatura)

Essas ideias podem voltar depois, mas exigem nova spec e nova decisão de arquitetura —
não implementar "de brinde" dentro de outra tarefa.
