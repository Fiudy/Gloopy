# Gloopy — Brief de Frontend para o Codex

Este documento é a especificação completa para construir o frontend do **Gloopy**.
Leia por inteiro antes de começar. Ele cobre identidade de marca, stack, páginas,
integração com o backend e requisitos de UX — mas **não é um manual passo a passo
a ser seguido à risca**. Onde o documento dá uma diretriz de marca ou uma regra de
negócio, siga-a; onde ele descreve layout, composição visual, microinterações e
detalhes de execução, use liberdade criativa para entregar algo que pareça
desenhado por um time de produto sênior, não um CRUD genérico.

**Requisito não-negociável: todo o código deve viver dentro de uma pasta
`frontend/` na raiz do projeto**, como um projeto irmão do backend (que já existe
em `gloopy-backend/` ou equivalente, dependendo de como o repositório foi
organizado). Não misture os dois.

---

## 1. O que é o Gloopy

Rede social de chat (conversas 1:1 e grupos, estilo WhatsApp — não servidores
públicos estilo Discord), com um diferencial: mini-games dentro da própria
conversa (hoje: jogo da velha), reaproveitando a mesma infraestrutura de tempo
real do chat. Web only, responsivo (mobile-first, mas usado também em desktop).

Tom de marca: **divertido e vibrante**, não corporativo, não infantil. Pense em
Discord + Duolingo, com um toque de streetwear/hypebeast no mascote.

---

## 2. Identidade de marca (seguir à risca)

### Nome e mascote
- **Nome**: Gloopy
- **Mascote**: um sapo estilizado em 3D, estilo "urban vinyl toy" / hypebeast
  character design. Veste moletom oversized roxo com estampa gráfica de chama
  laranja, chapéu bucket roxo com logo, corrente prateada com pingente "Gloopy".
  Personalidade: confiante, brincalhão, "descolado" — não fofo/infantil.

### Assets do mascote já disponíveis (em `assets/mascot/`, copiar para
`frontend/public/mascot/` ou `frontend/src/assets/mascot/` conforme a stack
escolhida)

| Arquivo | Pose/expressão | Onde usar |
|---|---|---|
| `gloopy-waving.png` | Corpo inteiro, acenando, sorriso aberto | Hero da landing page, tela de boas-vindas/onboarding |
| `gloopy-texting.png` | Corpo inteiro, mexendo no celular, balão de chat | Seção de features da landing, ilustração de "como funciona" |
| `gloopy-thumbsup.png` | Corpo inteiro, joia, fundo roxo sólido | Estado de sucesso (ex: confirmação de cadastro), CTA da landing |
| `gloopy-sleeping.png` | Corpo inteiro, dormindo, "zzz" | Estado vazio (nenhuma conversa ainda), indicador de "ausente"/offline, tela de erro leve (404) |
| `gloopy-icon.png` | Só cabeça/ombros, fundo roxo, cantos arredondados | Favicon, ícone do app (PWA), avatar padrão do sistema |
| `gloopy-cool.png` | Só cabeça/ombros, óculos escuros, fundo preto sólido | Loading states, splash screen, dark mode hero |
| `gloopy-cool-icon.png` | Igual ao acima, mas com cantos arredondados e glow roxo | Variante de ícone para superfícies que já têm fundo escuro |

Use essas imagens com intenção — cada uma já foi pensada pra um contexto
emocional (boas-vindas, sucesso, vazio/ausência, carregando). Não force encaixar
uma pose fora do contexto pra qual ela foi feita.

### Paleta
```
--gloopy-primary: #7C4DFF;      /* roxo vibrante - pode variar levemente por peça de arte, mas esse é o token de UI */
--gloopy-primary-deep: #6C3AC9; /* roxo profundo - usado no corpo/roupa do mascote */
--gloopy-accent: #FF8A3D;       /* laranja vibrante - CTAs, destaques, estampa do mascote */
--gloopy-bg-dark: #13111C;
--gloopy-bg-light: #F7F5FF;
--gloopy-status-online: #4ADE80;
--gloopy-status-away: #FBBF24;
--gloopy-status-offline: #9CA3AF;
```
Trate esses valores como ponto de partida, não lei absoluta — ajuste tons
intermediários (hover, disabled, superfícies elevadas) com liberdade, mas
mantenha a dupla roxo+laranja como identidade central em qualquer tela.

### Tipografia
- Títulos/marca: algo arredondado e cheio de personalidade (ex: **Baloo 2** ou
  **Fredoka**, via Google Fonts)
- Corpo de texto/UI: algo neutro e legível (ex: **Inter** ou **Sora**)

### Regra de conteúdo
Nunca gerar ou usar ilustrações do mascote com gestos de mão que possam ser lidos
como sinais de número ou de gangue — as imagens fornecidas já respeitam isso, mas
se novas variações forem criadas depois, mantenha essa restrição.

---

## 3. Stack sugerida (siga, mas a organização interna é livre)

- **React 18 + TypeScript + Vite** — SPA, sem necessidade de SSR (não há
  requisito de SEO complexo além da landing page, que pode ser uma rota estática
  dentro do mesmo app).
- **TailwindCSS** — configurar os tokens de cor/tipografia da seção 2 como
  extensão do tema (`tailwind.config`), não hardcode hex espalhado pelo código.
- **React Router** — roteamento client-side.
- **TanStack Query (React Query)** — cache e sincronização de dados do backend
  (conversas, mensagens, perfil). Evita reinventar loading/error/retry manual.
- **Zustand** (ou Context API pontual) — estado de UI local que não vem do
  servidor (ex: modal aberto, tema, estado de digitação local antes de emitir).
- **socket.io-client** — conexão de tempo real com o backend (ver seção 5).
- **Zod** — validação de formulários (login, registro, criar grupo etc.), integrado
  com **React Hook Form**.
- **lucide-react** — ícones (leve, consistente, MIT).

Estrutura de pastas sugerida dentro de `frontend/src/` — organize por **feature**,
não por tipo de arquivo genérico (evita a armadilha de pastas `components/`,
`hooks/`, `utils/` gigantes e desorganizadas conforme o projeto cresce):

```
frontend/
  src/
    app/                    # bootstrap, providers, rotas
    features/
      auth/                  # login, registro, sessão
      conversations/         # lista de conversas, criação de conversa/grupo
      chat/                  # timeline de mensagens, envio, digitando, mídia
      games/                 # convite e tabuleiro de jogo da velha
      presence/              # indicadores de status online/ausente
    shared/
      ui/                     # componentes de design system (Button, Avatar, Modal...)
      api/                    # cliente HTTP + cliente WebSocket configurados
      hooks/                  # hooks genéricos reutilizáveis entre features
    assets/
      mascot/                 # os PNGs fornecidos
  public/
    favicon (gerado a partir de gloopy-icon.png)
```

Sem redundância: se dois lugares precisam do mesmo botão/card/formatação, isso é
um componente em `shared/ui`, não um copy-paste. Sem código morto: não deixe
componentes, imports ou variáveis não utilizados.

---

## 4. Páginas obrigatórias

### 4.1 Landing page (`/`)
Pública, sem autenticação. Deve vender o produto em poucos segundos:
- Hero com `gloopy-waving.png`, headline forte, CTA para cadastro/login.
- Seção de "diferencial" (mini-games dentro do chat) — pode usar
  `gloopy-texting.png` aqui.
- Seção de features do chat em si (1:1, grupos, mídia, presença).
- Footer simples.
Fique à vontade pra ser criativo na composição visual (parallax leve, cards com
glow na paleta da marca, animações de entrada sutis) — é a página que mais
justifica investir em polimento visual.

### 4.2 Login / Registro (`/login`, `/register`)
**Usabilidade é a prioridade #1 aqui.** Requisitos mínimos:
- Formulários com validação inline (erro aparece assim que o campo perde foco,
  não só no submit).
- Estados de loading claros no botão de submit (evitar duplo-clique/duplo-submit).
- Mensagens de erro da API (ex: "e-mail já cadastrado", "credenciais inválidas")
  exibidas de forma clara, não um alert genérico.
- Alternância fácil entre login e registro (link cruzado).
- Campo de senha com toggle de mostrar/ocultar.
- Acessibilidade: labels associados aos inputs, navegação por teclado funcional,
  contraste adequado (a paleta roxo/laranja escura precisa de texto claro o
  suficiente por cima).
- Responsivo: em mobile, formulário ocupa a tela com conforto; em desktop, pode
  ter uma composição split-screen com arte do mascote de um lado.

### 4.3 Páginas internas (autenticado)
- **Lista de conversas** (`/conversations`) — conversas 1:1 e grupos, com
  indicador de não lida, último preview de mensagem, status de presença do
  interlocutor (1:1). Conversas DIRECT pendentes (`isPending: true` na API)
  devem se destacar visualmente com algo como "Fulano quer falar com você".
- **Conversa individual** (`/conversations/:id`) — timeline de mensagens
  (texto, mídia, convite de jogo como card especial), indicador de "digitando",
  campo de envio com suporte a anexar mídia, indicador de leitura (double-check),
  ações de editar/apagar mensagem (respeitando a janela de 15 min pra edição —
  desabilite a opção de editar na UI quando expirado, não confie só no erro da API).
- **Criar grupo** — fluxo de selecionar participantes + nome do grupo.
- **Configurações do grupo** — renomear, trocar avatar, gerenciar participantes
  (promover/rebaixar admin, remover), sair do grupo — visível conforme o papel
  do usuário logado (admin vê mais ações que membro comum).
- **Perfil/configurações do usuário** — editar nome/avatar, toggle de "visto por
  último" e "confirmação de leitura" (ambos existem como flags no backend).
- **Convite/tabuleiro de jogo da velha** — quando uma mensagem é do tipo
  `GAME_INVITE`, renderizar um card com aceitar/recusar; ao aceitar, abrir o
  tabuleiro (grid 3x3) com atualização em tempo real via WebSocket.

Todas as páginas internas devem ser **responsivas de verdade** — não apenas
"não quebra", mas usável com conforto em mobile (lista de conversas vira tela
cheia, conversa aberta vira outra tela cheia, com navegação de voltar, ao invés
de tentar espremer um layout de duas colunas de desktop numa tela pequena).

### Estados a não esquecer (em qualquer página com dados assíncronos)
- Loading (pode usar `gloopy-cool.png` como elemento visual de carregamento)
- Vazio (ex: nenhuma conversa ainda → `gloopy-sleeping.png` com uma mensagem
  amigável)
- Erro (rede caiu, requisição falhou)

---

## 5. Integração com o backend

O backend é NestJS, já implementado, rodando em `http://localhost:3333` por
padrão (porta configurável). Toda a documentação de regras de negócio está no
`CLAUDE.md` do repositório do backend — vale ler antes de montar os formulários e
telas, pra UI não permitir uma ação que a API vai rejeitar (ex: não mostrar botão
de "editar" em mensagem com mais de 15 minutos, não permitir grupo com 0
participantes além do criador).

### Configuração
Crie um `.env` no `frontend/` com pelo menos:
```
VITE_API_URL=http://localhost:3333
VITE_WS_URL=http://localhost:3333
```
Nunca hardcode a URL da API no código — sempre via variável de ambiente, pra
funcionar tanto em dev quanto quando o usuário fizer deploy no próprio servidor.

### Autenticação
- `POST /auth/register { name, email, password }` → cria conta.
- `POST /auth/login { email, password }` → retorna `{ accessToken, user }`.
- Guarde o `accessToken` (localStorage é aceitável para este projeto - avalie
  se quer migrar pra um esquema com refresh token/cookie httpOnly depois, mas
  não é requisito bloqueante agora).
- Toda rota autenticada exige header `Authorization: Bearer <token>` — centralize
  isso num cliente HTTP único (ex: instância do `axios` ou wrapper de `fetch` em
  `shared/api/`), nunca repita a lógica de header em cada chamada.

### Endpoints REST principais
```
GET    /conversations
POST   /conversations/direct        { recipientId }
POST   /conversations/group         { name, memberIds[] }
GET    /conversations/:id/messages?before=&limit=
POST   /conversations/:id/messages  { content }
POST   /conversations/:id/media-messages { mediaAssetId, caption? }
PATCH  /messages/:id                { content }
DELETE /messages/:id?scope=ME|EVERYONE
POST   /messages/:id/read

POST   /conversations/:id/participants/:userId
DELETE /conversations/:id/participants/:userId
POST   /conversations/:id/leave
POST   /conversations/:id/participants/:userId/promote
POST   /conversations/:id/participants/:userId/demote

POST   /media                       (multipart, campo "file") → { id, url, kind, mimeType, sizeBytes, fileName }

POST   /conversations/:id/game-invites { opponentId }
GET    /games/:sessionId
POST   /games/:sessionId/respond    { response: "ACCEPT" | "DECLINE" }
POST   /games/:sessionId/moves      { cellIndex: 0-8 }
```

### WebSocket (tempo real)
Conectar com o token no handshake:
```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL, {
  auth: { token: `Bearer ${accessToken}` },
});
```

Eventos do servidor pra escutar: `message:created`, `message:updated`,
`message:deleted`, `conversation:created`, `conversation:participants_changed`,
`presence:update`, `typing:update`, `game:updated`.

Eventos que o cliente emite: `conversation:join` / `conversation:leave`
(entrar/sair da sala de uma conversa — necessário pro indicador de "digitando"
funcionar, já que ele só propaga dentro da sala da conversa), `typing:start` /
`typing:stop`.

Estratégia recomendada: quando um evento `message:created` chegar, invalide a
query do React Query da lista de mensagens daquela conversa (ao invés de tentar
fazer merge manual de estado) — mais simples e menos propenso a bug de estado
dessincronizado.

### Upload de mídia
Fluxo de duas etapas (não é um único request): primeiro `POST /media` (upload
puro, multipart), que retorna um `mediaAssetId` + URL já assinada; depois
`POST /conversations/:id/media-messages` com esse `mediaAssetId` pra efetivamente
mandar na conversa. Isso permite, por exemplo, mostrar uma prévia do arquivo
antes do usuário confirmar o envio.

---

## 6. Checklist de qualidade antes de considerar pronto

- [ ] Roda com `npm run dev` dentro de `frontend/` sem erros de console
- [ ] Todas as chamadas à API passam pelo cliente HTTP centralizado (nenhum
  `fetch`/`axios` solto direto num componente)
- [ ] Sem componente, import ou variável não utilizados
- [ ] Testado em pelo menos 3 larguras (mobile ~375px, tablet ~768px, desktop
  ~1280px) — layout não quebra em nenhuma
- [ ] Formulários de login/registro navegáveis 100% por teclado
- [ ] Paleta e tipografia da seção 2 aplicadas via tokens do Tailwind, não hex
  soltos pelo código
- [ ] Assets do mascote usados nos contextos sugeridos na tabela da seção 2

Seja criativo na execução — micro-animações, transições de página, hover states
com personalidade — desde que sirva a usabilidade e não a atrapalhe. O objetivo é
um produto que pareça vivo e divertido, sem parecer amador.
