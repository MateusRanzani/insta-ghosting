# Feature: Comparador de Seguidores

## Objetivo

Permitir que o usuário descubra, a partir do próprio arquivo de exportação de dados do
Instagram, quem ele segue e não é seguido de volta, e quem o segue e ele não segue de volta.

## Contexto / por que isso existe

O Instagram exige login até para ver listas de seguidores de perfis públicos, e a API
oficial (Graph API) não expõe esses dados de forma prática para esse caso de uso. A única
via seleção segura e dentro dos Termos de Serviço é usar o arquivo de exportação de dados
que a própria Meta disponibiliza ao usuário. Ver `CLAUDE.md` para os princípios de produto
(sem login, sem scraping, sem backend).

## Fluxo do usuário

1. Usuário chega na landing page e entende o que o app faz
2. Usuário segue o tutorial embutido para solicitar a exportação de dados no Instagram
   (Configurações → Central de Contas → Suas informações e permissões → Exportar informações)
3. Usuário aguarda o e-mail/notificação da Meta avisando que o arquivo está pronto
   (normalmente algumas horas, se seguir as recomendações do tutorial)
4. Usuário volta ao app e faz upload do `.zip` (drag & drop ou seleção de arquivo)
5. App extrai e processa o zip **no navegador**
6. App exibe o resultado em duas listas, com busca/filtro

## Requisitos funcionais

- [ ] Landing page com explicação do produto e CTA para o tutorial/upload
- [ ] Tutorial visual passo a passo de como exportar os dados, incluindo as otimizações:
  - Selecionar apenas a categoria "Conexões" (não "todas as informações")
  - Formato JSON (não HTML)
  - Qualidade de mídia baixa/nenhuma (acelera a geração do arquivo)
  - Não incluir "registros de dados" (data logs) — não é necessário e demora até 15 dias
- [ ] Componente de upload (drag & drop + seleção manual) aceitando `.zip`
- [ ] Extração do `.zip` no navegador via JSZip
- [ ] Parser dos arquivos:
  - `connections/followers_and_following/followers_1.json`
  - `connections/followers_and_following/following.json`
- [ ] Lógica de comparação (set diff):
  - "Não te seguem de volta" = following - followers
  - "Você não segue de volta" = followers - following
- [ ] Tela de resultado com:
  - Duas listas/abas separadas
  - Busca por username dentro de cada lista
  - Contador total em cada lista
- [ ] Tratamento de erro claro se o zip não tiver a estrutura esperada (ver "Casos de erro")

## Requisitos não funcionais

- Nenhum dado do usuário é enviado a um servidor — todo o parsing roda em JS no navegador
- Sem dependência de backend no MVP
- Deve funcionar com arquivos de exportação de contas com listas grandes (10k+ perfis) sem
  travar a UI — considerar processamento em chunks ou web worker se necessário

## Estrutura de dados esperada (formato Meta, pode variar — validar ao implementar)

```json
// following.json
{
  "relationships_following": [
    {
      "string_list_data": [
        {
          "href": "https://www.instagram.com/username",
          "value": "username",
          "timestamp": 1234567890
        }
      ]
    }
  ]
}
```

`followers_1.json` segue a mesma estrutura, mas a chave raiz pode variar (verificar ao
receber um arquivo real — a Meta já alterou esse schema antes, então o parser deve validar
a presença dos campos antes de assumir a estrutura).

## Critérios de aceite

- Usuário consegue completar o fluxo inteiro (upload → resultado) sem sair da página
- Nenhuma requisição de rede é feita com os dados do zip (verificável via DevTools/Network)
- Resultado é exibido em menos de alguns segundos para uma conta com até ~5.000 perfis
- Mensagens de erro são compreensíveis para alguém não técnico (nunca expor stack trace)

## Casos de erro a tratar

- Zip sem os arquivos esperados (estrutura errada, usuário fez upload do zip errado)
- Zip corrompido ou não é um zip válido
- JSON com schema diferente do esperado (Meta mudou o formato)
- Arquivo muito grande / muitos perfis (definir um limite razoável e avisar o usuário)

## Fora de escopo desta spec

- Histórico entre exportações
- Contas de usuário / login
- Fotos de perfil nas listas (o export da Meta não inclui foto, só username/link/timestamp)
- Qualquer chamada ao Instagram além da leitura do arquivo local

## Referência visual

Ver seção "Identidade visual" do `CLAUDE.md`. Gradiente do Instagram usado com moderação,
cards de feature, botões pill, tom limpo e confiável (reforçar "sem login, sem risco" na UI).
