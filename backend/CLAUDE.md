# Gloopy — Contexto do Projeto

Este arquivo é a fonte de verdade sobre o que o Gloopy é, as decisões já tomadas e o
que falta implementar. Leia por completo antes de tocar em código.

## O que é o Gloopy

Rede social de chat (1:1 e grupos, estilo WhatsApp — não servidores públicos estilo
Discord), com um diferencial: mini-games e activities síncronas dentro da própria
conversa, reaproveitando a mesma infraestrutura de tempo real do chat. Público geral,
não nichado. Web only (responsivo) por enquanto.

Owner: Guilherme, dev fullstack, prefere clean code, DDD e arquitetura profissional.
Prefere self-hosted / infra gratuita sempre que possível. Frontend será feito à parte
com o Codex (a partir de prompts JSON); o Claude Code deve focar no **backend**.

## Identidade de marca (já fechada — não renegociar sem o usuário pedir)

- **Nome**: Gloopy
- **Mascote**: um sapo estilizado em 3D, estilo "urban vinyl toy" / hypebeast
  character design (referência: mascote "Slligy" no Behance) — boca larga com dentes
  à mostra, olhos redondos grandes (esclera amarelo-dourada, pupila escura grande),
  textura de pele fosca tipo borracha/couro (não glossy/plástico). Veste streetwear:
  moletom oversized roxo com estampa gráfica de chama laranja, chapéu bucket roxo,
  corrente prateada com pingente "Gloopy" em logotipo grafite.
- **Paleta oficial**:
  - Primária: laranja vibrante `#FF8A3D`
  - Secundária: roxo profundo `#6C3AC9`
  - Corpo do mascote usa gradiente laranja→roxo (cabeça mais laranja, pernas mais roxo)
  - Fundo dark: `#13111C` / Fundo light: `#F7F5FF`
  - Status online: `#4ADE80` · ausente: `#FBBF24` · offline: `#9CA3AF`
- **Tipografia**: títulos em Baloo 2 ou Fredoka (arredondada/amigável); corpo de
  texto em Inter ou Sora (neutra, legível).
- **Poses do mascote já geradas/planejadas**: hero pose full-body, ícone de app
  (headshot fechado), T-pose (referência 3D/rigging). Poses pendentes de geração:
  digitando no celular, acenando/onboarding, dormindo/ausente, pensativo/loading.
- Restrição importante já aplicada nos prompts de geração: **nunca gerar gestos de
  mão que possam ser lidos como sinais de número/gangue** — só mão aberta ou joia.

## Stack técnica e decisões de arquitetura

- **Backend**: NestJS + TypeScript, arquitetura **DDD por bounded context** — cada
  módulo em `src/modules/<contexto>/` tem 4 camadas: `domain/` (entidades e regras
  puras, zero dependência de framework), `application/` (use cases, orquestram
  repositórios via interface), `infrastructure/` (implementações concretas — Prisma,
  Redis), `presentation/` (controllers REST e/ou gateways WebSocket).
- **ORM**: Prisma. **Banco**: PostgreSQL.
- **Cache/Presença**: Redis (via `ioredis`).
- **Fila**: RabbitMQ (`amqplib`) — infra já sobe no docker-compose, mas **ainda não
  está integrada ao código** (ver pendências).
- **Storage de mídia**: MinIO (compatível com S3) — infra já sobe, código pendente.
- **Realtime**: um único `RealtimeGateway` (fora de qualquer bounded context, em
  `src/realtime/`) traduz eventos de domínio (`@nestjs/event-emitter`, `@OnEvent`)
  em eventos de WebSocket (`socket.io`). Convenção de salas:
  - `user:{userId}` → notificações diretas (nova mensagem, nova conversa)
  - `conversation:{id}` → eventos ao vivo de quem tem a conversa aberta (digitando)
- **Auth**: JWT (`@nestjs/jwt` + `passport-jwt`).
- **Docker**: todos os serviços em portas **não-padrão no host** (para não colidir
  com outros serviços que já rodam no servidor do usuário):

  | Serviço             | Porta host | Porta interna |
  |---------------------|-----------|----------------|
  | API / WebSocket      | 3333      | 3333           |
  | Postgres             | 5544      | 5432           |
  | Redis                | 6380      | 6379           |
  | RabbitMQ (AMQP)        | 5673      | 5672           |
  | RabbitMQ (painel)      | 15673     | 15672          |
  | MinIO (API S3)         | 9500      | 9000           |
  | MinIO (console)        | 9501      | 9001           |

- **Path aliases**: `@shared/*`, `@common/*`, `@modules/*` (configurados no
  `tsconfig.json`; em runtime de produção dependem de `tsconfig-paths/register` —
  já configurado no `Dockerfile` e no script `start:prod`).

## Regras de negócio já fechadas e implementadas (Fase 1)

### Conversas
- 1:1 é criada **automaticamente** no primeiro contato, mas fica "pendente"
  (`acceptedAt = null`) até o destinatário responder — é isso que sustenta a UX de
  "Fulano quer falar com você" no front. Vira aceita quando o destinatário envia
  a primeira mensagem (`SendMessageUseCase` chama `conversation.acceptDirect()`).
- Grupo: múltiplos admins, com CRUD completo (adicionar/remover membro, renomear,
  trocar avatar, promover/rebaixar admin). Limite de **1024 participantes**
  (`MAX_GROUP_PARTICIPANTS` em `conversation.entity.ts`).
- Sair ou ser removido de um grupo gera mensagem de sistema. Se o único admin sai,
  o membro mais antigo é promovido automaticamente (ver `Conversation.leave()`).
- Não é possível remover o último admin restante (regra de invariante no agregado).

### Mensagens
- Edição: só quem enviou, dentro de **15 minutos** do envio
  (`MESSAGE_EDIT_WINDOW_MINUTES` em `message.entity.ts`, estilo WhatsApp).
- Exclusão "para mim" (qualquer participante, sobre si mesmo) e "para todos" (só
  quem enviou) — **sem prazo** em ambos os casos.
- Confirmação de leitura (`MessageRead`) — opcional, controlada por
  `user.readReceiptsEnabled` (default: true / "double-check azul" ligado).
- "Visto por último" (`User.lastSeenAt`) — público por padrão, controlado por
  `user.showLastSeen`.

### Presença
- Suporta múltiplos dispositivos: um usuário só fica "offline" quando a **última**
  conexão WebSocket cai (contagem de sockets no Redis, `RedisPresenceRepository`).
- "Digitando…" propagado via sala `conversation:{id}` no WebSocket
  (eventos `typing:start` / `typing:stop` do cliente → `typing:update` para os
  demais). O timeout de ~3s pra sumir o indicador é responsabilidade do **cliente**
  (debounce), não do servidor.

### Media
- Tipos aceitos: imagem, vídeo, áudio, documento (lista fechada de mime types).
- Tamanho máximo: 100MB por arquivo.
- Upload e envio para uma conversa são duas chamadas separadas (upload não cria
  mensagem sozinho).
- URL de acesso ao arquivo nunca é fixa/persistida - sempre presigned, gerada sob
  demanda (expira em 24h).
- Só quem fez upload do arquivo pode anexá-lo numa mensagem.

### Games (jogo da velha - primeiro jogo, prova de conceito)
- Convite vira uma mensagem especial (`GAME_INVITE`) na conversa.
- Quem convida sempre joga com X e começa a partida assim que o convite é aceito.
- Só o convidado pode aceitar/recusar; só quem tem a vez pode jogar.
- Estado da partida (`GameSession`) é separado da mensagem de convite - a
  mensagem só referencia o `gameSessionId`, o estado ao vivo é buscado à parte.

## O que já está implementado (Fase 1 — completa, + barramento RabbitMQ)

- **Identity**: registro, login, JWT (`src/modules/identity/`).
- **Messaging**: conversas 1:1/grupo, mensagens (enviar/editar/apagar/listar),
  gestão de participantes (`src/modules/messaging/`).
- **Presence**: online/offline multi-dispositivo, "visto por último"
  (`src/modules/presence/`).
- **Media**: upload de imagem/vídeo/documento/áudio via MinIO, mensagens do tipo
  `MEDIA` na conversa (`src/modules/media/` + integração em `messaging/`).
- **Games**: convite de jogo da velha como mensagem especial, partida com estado
  sincronizado via barramento (`src/modules/games/`).
- **Realtime + RabbitMQ**: barramento de eventos real via exchange topic
  `gloopy.events` (`src/shared/infrastructure/rabbitmq/`) - cada conexão WebSocket
  declara sua própria fila efêmera (`autoDelete`) ligada à routing key
  `user.{userId}`, o que dá suporte nativo a múltiplos dispositivos do mesmo
  usuário (cada um recebe cópia do evento) e permite escalar a API para várias
  instâncias sem perder entrega. O indicador de "digitando" continua em memória
  local (sala do socket.io) de propósito - é efêmero e de baixíssima latência, não
  vale o custo de fila; limitação conhecida: só propaga entre clientes conectados
  à mesma instância (ok por ora, revisitar se/quando escalar horizontalmente).
- Docker-compose completo (Postgres, Redis, RabbitMQ, MinIO, API).

### Nota sobre o desenho da fila (decisão consciente, não esquecimento)
A fila **não** persiste mensagens pra redelivery de usuários offline - eventos
publicados sem fila vinculada (usuário sem conexão ativa) são descartados pelo
RabbitMQ (comportamento padrão de exchange topic sem binding correspondente). Isso
é intencional: a mensagem em si já está persistida no Postgres desde o
`SendMessageUseCase`; a "recuperação" de mensagens perdidas enquanto offline já é
coberta pelo endpoint `GET /conversations/:id/messages`, que o front deve chamar ao
reconectar. O papel do RabbitMQ aqui é **só** desacoplar a publicação de eventos da
entrega em tempo real (permitindo múltiplas instâncias da API), não ser uma fila de
persistência/retry. Se no futuro isso precisar de garantia de entrega mais forte
(ex: notificações push mesmo com o app fechado), aí sim vale desenhar uma fila
durável por usuário - mas não foi essa a necessidade que motivou implementar isso agora.

## O que falta implementar — em ordem sugerida

### 0. Pendências da própria Fase 1 (fazer antes de avançar)
- [ ] Rodar `npx prisma generate` + `npx prisma migrate dev` de fato (não foi
  possível no ambiente onde este código foi gerado, por restrição de rede —
  o schema em `prisma/schema.prisma` está pronto, só falta gerar a migration).
- [ ] Testes automatizados das regras de domínio mais críticas: edição com prazo
  expirado, remoção do último admin, promoção automática ao sair o último admin,
  limite de participantes do grupo, aceite de conversa DIRECT.
- [ ] Configurar `@nestjs/throttler` (já está no `package.json`, mas não
  registrado em nenhum module ainda) — rate limit em `/auth/login` e
  `/auth/register` no mínimo.

### 1. Media context — IMPLEMENTADO
Upload via `POST /media` (multipart, campo `file`), autenticado. Regras aplicadas
no domínio (`media/domain/value-objects/media-file.vo.ts`):
- Tipos aceitos: imagem (`image/*`), vídeo (`video/*`), áudio (`audio/*`) e uma
  lista fechada de mime types de documento (pdf, doc/docx, xls/xlsx, ppt/pptx,
  txt, zip) — ver `DOCUMENT_MIME_TYPES` se precisar adicionar mais.
- Tamanho máximo: 100MB (`MAX_FILE_SIZE_BYTES`), validado tanto no domínio quanto
  no limite do Multer (`FileInterceptor`).
- Storage: MinIO via `minio` (npm), bucket criado automaticamente no boot
  (`onModuleInit` do `MinioMediaStorageRepository`) se não existir.
- **URL nunca é persistida fixa** - só a `storageKey` é salva no banco; a URL é
  sempre uma presigned URL gerada na hora (expira em 24h por padrão), tanto no
  retorno do upload quanto ao listar mensagens.
- Enviar a mídia numa conversa é uma chamada separada:
  `POST /conversations/:id/media-messages { mediaAssetId, caption? }` - o upload
  em si não cria mensagem sozinho (permite, por exemplo, fazer upload e decidir
  depois em qual conversa mandar, ou cancelar sem nunca ter mandado).
- Segurança: `SendMediaMessageUseCase` verifica que quem está anexando o arquivo
  foi quem fez o upload (`mediaAsset.uploaderId === senderId`) - impede anexar
  `mediaAssetId` de outra pessoa mesmo que ela consiga adivinhar o UUID.
- Mensagens de mídia têm rate de edição herdado de `Message.edit()`, que já
  bloqueia edição pra qualquer tipo diferente de `TEXT` - ou seja, mídia não pode
  ser "editada" (faz sentido: você reenviaria outro arquivo).
- **Ainda não feito dentro de Media**: processamento assíncrono (gerar thumbnail
  de vídeo, compactar imagem) - hoje o arquivo sobe do jeito que veio. Se isso
  virar necessidade real, publicar um evento no barramento (`MessageBusPublisher`)
  após o upload e ter um worker consumidor, em vez de bloquear a resposta do
  upload.

### 2. Games/Activities context — jogo da velha IMPLEMENTADO, resto pendente

**O que já funciona** (`src/modules/games/`):
- `GameSession` (agregado raiz) separa regra de turno/convite/vitória (na
  entidade) da regra do tabuleiro em si (no VO `TicTacToeBoard`) - de propósito,
  pra um novo jogo no futuro só precisar de um novo VO de tabuleiro/estado,
  reaproveitando o resto (fluxo de convite, aceite, notificação).
- Convite de jogo é uma mensagem especial (`MessageType.GAME_INVITE`), mesmo
  padrão usado pra `MEDIA` - a mensagem carrega só o `gameSessionId`, o estado
  completo da partida é buscado à parte via `GET /games/:sessionId` (evita
  Messaging e Games dependerem um do outro em círculo - `GamesModule` importa
  `MessagingModule`, nunca o contrário).
- Fluxo: `POST /conversations/:id/game-invites {opponentId}` → cria a
  `GameSession` (`PENDING`) + mensagem de convite → `POST /games/:id/respond
  {response: ACCEPT|DECLINE}` → se aceito, quem convidou (sempre X) começa →
  `POST /games/:id/moves {cellIndex}` alterna o turno, valida vitória/empate.
- Toda atualização de estado (`game:updated`) é publicada via
  `MessageBusPublisher` pros dois jogadores - mesmo barramento RabbitMQ que o
  resto do app, sem mecanismo paralelo.
- Autorização: `GameSession.accept/decline/move` já validam por dentro do
  domínio que quem está agindo é o jogador certo, na vez certa; `GetGameSessionUseCase`
  garante que só os dois jogadores conseguem ler o estado da partida.

**O que falta** (fora de escopo desta rodada, retomar quando fizer sentido):
- Generalizar de "jogo da velha" pra "Activities" (watch party/listen together) -
  hoje `GameSession.type` só aceita `TIC_TAC_TOE`; um novo tipo de jogo precisa
  de um novo VO de estado (nos moldes de `TicTacToeBoard`) e provavelmente um
  novo conjunto de métodos na entidade, já que "watch party" tem semântica de
  sincronização diferente de "jogo por turnos" (não tem "vez de quem", por
  exemplo) - pode valer a pena separar em duas entidades/agregados distintos em
  vez de forçar tudo dentro de `GameSession`.
- Presença rica ("jogando Jogo da Velha") mencionada lá na concepção do produto -
  ainda não conectada ao contexto de `Presence`.
- Não há endpoint pra listar convites de jogo pendentes de um usuário (hoje só
  dá pra descobrir via a mensagem `GAME_INVITE` na conversa).

### 3. Calling context (fora de escopo imediato — mencionar só se pedido)
- Sinalização WebRTC, 1:1 primeiro (grupo fica pra depois).
- Precisa de servidor **coturn** (TURN/STUN) self-hosted — gratuito, mas exige setup
  de infra próprio (não é só container simples, precisa de portas UDP abertas).
- Só entrar nisso depois de Media e Games estarem sólidos.

## Convenções a manter em qualquer código novo

- Toda regra de negócio nova vai no `domain/`, nunca em controller/gateway.
- Repositórios sempre como interface (`abstract class`) no domínio, implementação
  concreta na infraestrutura, ligadas via `useClass` no `*.module.ts`.
- Erros de regra de negócio lançam `DomainError` (`@shared/domain/domain-error.ts`),
  nunca `HttpException` diretamente dentro do domínio — quem traduz para HTTP é o
  `DomainExceptionFilter` já registrado globalmente.
- Comunicação entre bounded contexts e a camada de tempo real acontece via
  `MessageBusPublisher` (`@shared/application/message-bus.port.ts`), implementado
  com RabbitMQ (`@shared/infrastructure/rabbitmq/`) - **não** use
  `@nestjs/event-emitter` (foi removido do projeto de propósito: só funcionava numa
  única instância em memória, o que impedia escalar a API horizontalmente). Use
  cases injetam `MessageBusPublisher` e chamam `publishToUser`/`publishToConversation`
  (ou o helper `publishToUsers` para múltiplos destinatários de uma vez).
- Sem redundância, sem código morto — o usuário é explícito sobre isso.
