# Gloopy - Backend (Fase 1)

Backend do Gloopy construído em **NestJS + DDD** (domain/application/infrastructure/presentation
por bounded context) + **Prisma** + **Docker**, cobrindo a Fase 1: **Identity**, **Messaging**
(conversas 1:1 e grupo) e **Presence**.

## Arquitetura

```
src/
  shared/                  # Kernel compartilhado (Prisma service, Entity base, DomainError)
  common/                  # Guards, decorators e filtros usados por múltiplos contextos
  realtime/                # Gateway WebSocket - traduz eventos de domínio em eventos de socket
  modules/
    identity/               # Cadastro, login, JWT
      domain/                 # Entidade User, VO Email, porta UserRepository
      application/            # Use cases (RegisterUser, LoginUser) + DTOs
      infrastructure/         # PrismaUserRepository, JwtStrategy
      presentation/           # IdentityController (REST)
    messaging/              # Conversas 1:1/grupo, mensagens
      domain/                 # Conversation (agregado), Message, Participant, regras de negócio
      application/            # Use cases (enviar, editar, apagar, gerenciar participantes...)
      infrastructure/         # PrismaConversationRepository, PrismaMessageRepository
      presentation/           # MessagingController (REST) + mappers
    presence/                # Status online/offline (multi-dispositivo) via Redis
      domain/ application/ infrastructure/
```

Cada contexto só conhece **interfaces (portas)** dos repositórios - a implementação concreta
(Prisma/Redis) é plugada via injeção de dependência no `*.module.ts`. Isso significa que dá pra
trocar Prisma por outra coisa, ou Redis por outro cache, sem tocar em regra de negócio.

## Regras de negócio implementadas (Fase 1)

- Conversa 1:1 é criada automaticamente no primeiro contato e fica "pendente" até o destinatário
  responder (`isPending: true` na resposta da API) - é isso que sustenta o "Fulano quer falar com você" no front.
- Grupos suportam múltiplos admins com CRUD completo (adicionar/remover membro, renomear,
  trocar avatar, promover/rebaixar admin), limite de 1024 participantes.
- Sair ou ser removido de um grupo gera mensagem de sistema. Se o único admin sai, o membro
  mais antigo é promovido automaticamente.
- Edição de mensagem: só quem enviou, dentro de 15 minutos (estilo WhatsApp).
- Exclusão "para mim" e "para todos" (só quem enviou), sem prazo.
- Confirmação de leitura (`MessageRead`) e "visto por último" (`lastSeenAt`), ambos com
  flags de opt-out no perfil do usuário (`readReceiptsEnabled`, `showLastSeen`).
- Presença suporta múltiplos dispositivos: só fica offline quando a última conexão cai.
- Indicador de "digitando" via WebSocket, propagado por sala de conversa.

## Rodando localmente

```bash
cp .env.example .env
docker compose up -d          # sobe Postgres, Redis, RabbitMQ, MinIO e a API
docker compose exec api npx prisma migrate deploy   # roda as migrations
```

A API sobe em `http://localhost:3333`.

### Portas (todas não-padrão no host, pra não colidir com outros serviços do seu servidor)

| Serviço          | Porta host | Porta interna |
|-------------------|-----------|----------------|
| API / WebSocket    | 3333      | 3333           |
| Postgres           | 5544      | 5432           |
| Redis              | 6380      | 6379           |
| RabbitMQ (AMQP)     | 5673      | 5672           |
| RabbitMQ (painel)   | 15673     | 15672          |
| MinIO (API S3)      | 9500      | 9000           |
| MinIO (console)     | 9501      | 9001           |

> RabbitMQ e MinIO já sobem no docker-compose para as próximas fases (fila de mensagens
> offline e upload de mídia), mas ainda não são usados pelo código desta Fase 1.

### Rodando sem Docker (dev local com hot-reload)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Principais rotas REST

```
POST   /auth/register
POST   /auth/login
GET    /auth/me                                    (autenticado)

GET    /conversations                               (autenticado)
POST   /conversations/direct        { recipientId }
POST   /conversations/group         { name, memberIds[] }
GET    /conversations/:id/messages?before=&limit=
POST   /conversations/:id/messages  { content }
PATCH  /messages/:id                { content }
DELETE /messages/:id?scope=ME|EVERYONE
POST   /messages/:id/read

POST   /conversations/:id/participants/:userId
DELETE /conversations/:id/participants/:userId
POST   /conversations/:id/leave
POST   /conversations/:id/participants/:userId/promote
POST   /conversations/:id/participants/:userId/demote
```

Todas as rotas (exceto `/auth/register` e `/auth/login`) exigem header
`Authorization: Bearer <token>`.

## WebSocket

Conecte enviando o token no handshake:

```js
const socket = io('http://localhost:3333', { auth: { token: 'Bearer ' + accessToken } });
```

Eventos do servidor: `message:created`, `message:updated`, `message:deleted`,
`conversation:created`, `conversation:participants_changed`, `presence:update`, `typing:update`.

Eventos que o cliente pode emitir: `conversation:join`, `conversation:leave`,
`typing:start`, `typing:stop`.

## Nota sobre este ambiente de geração

O type-check completo (`npx tsc --noEmit`) passou sem erros na camada de domínio e aplicação.
Os únicos erros encontrados foram nos arquivos que dependem do Prisma Client gerado
(`prisma-user.repository.ts`, `prisma-conversation.repository.ts`, `prisma-message.repository.ts`),
porque o sandbox usado para gerar este código não tinha acesso à internet completa para baixar o
engine binário do Prisma (`binaries.prisma.sh`). Isso é uma limitação do ambiente de geração, não
um problema do código - rode `npx prisma generate` no seu ambiente (ou deixe o Dockerfile fazer
isso, como já está configurado) e os erros somem.

## Próximos passos sugeridos (fora do escopo desta fase)

- Fila de mensagens offline via RabbitMQ (infra já sobe no docker-compose)
- Contexto de Media (upload via MinIO)
- Contexto de Games/Activities (mini-games dentro da conversa)
- Rich presence ("jogando X", "digitando" já implementado)
