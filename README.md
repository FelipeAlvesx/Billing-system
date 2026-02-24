# Billing SaaS API

Uma plataforma completa de faturamento para SaaS que implementa um sistema robusto de gerenciamento de planos, subscriptions, metragem de uso e controle de acesso baseado em features.

---

## O que é?

Sistema backend que gerencia toda a lógica de billing e controle de acesso de uma plataforma SaaS multi-tenant. Permite:

- **Autenticação** de usuários com JWT
- **Múltiplos Planos** (FREE, PRO, ENTERPRISE)
- **Feature Gating** — bloqueia acesso a funcionalidades baseado no plano
- **Metragem de Uso** — rastreia consumo de métricas (ex: API calls/mês) e bloqueia ao atingir limite
- **Webhooks** — simula eventos de pagamento (invoice.paid, payment_failed, subscription.deleted)
- **Status de Subscription** — ACTIVE, PAST_DUE, CANCELED
- **Reset Automático** — zera uso todo mês via job agendado

---

## Como funciona?

### 1. Planos (Plans)

Define quais features e limites cada tier tem:

```
FREE:
  - features: []
  - limits: API_CALLS=100/mês

PRO:
  - features: [EXPORT_PDF, ADVANCED_ANALYTICS]
  - limits: API_CALLS=10000/mês

ENTERPRISE:
  - features: [EXPORT_PDF, ADVANCED_ANALYTICS, PRIORITY_SUPPORT]
  - limits: API_CALLS=unlimited
```

### 2. Subscriptions (Usuário → Plano)

Vincula um usuário a um plano com status de pagamento:

```
User 1 → PRO plan (status: ACTIVE, período: Feb 1-28)
User 2 → FREE plan (status: ACTIVE, período: Feb 1-28)
User 3 → PRO plan (status: PAST_DUE, período: Feb 1-28)
```

### 3. Feature Gating

Middleware que valida se o usuário tem acesso a uma feature:

```
POST /exports/pdf → requireFeature('EXPORT_PDF')
  ✓ PRO/ENTERPRISE → permite
  ✗ FREE → 403 FEATURE_NOT_ALLOWED
```

### 4. Metragem de Uso (Usage)

Rastreia consumo mensal de métricas:

```
User 1 (PRO):
  - API_CALLS: 5000 consumidos / 10000 limite
  - Se chamar /api/data → incrementa contador

User 2 (FREE):
  - API_CALLS: 100 consumidos / 100 limite
  - Se chamar /api/data novamente → 429 USAGE_LIMIT_EXCEEDED
```

### 5. Webhooks & Status

Simula eventos de pagamento que mudam o status da subscription:

```
webhook: invoice.paid → subscription.status = ACTIVE
webhook: payment_failed → subscription.status = PAST_DUE
webhook: subscription.deleted → subscription.status = CANCELED
```

Se status = PAST_DUE → bloqueia acesso a features pagas.

### 6. Fluxo Completo

```
1. User registra → nasce com subscription FREE + usage_counter = 0
2. User muda para PRO → subscription.plan_id muda, acesso a features libera
3. User chama /api/data → consome 1 API_CALL (5000/10000)
4. Mês termina → usage_counter reseta automaticamente (0/10000)
5. Payment falha → status PAST_DUE → features pagas bloqueadas
```

---

## 🛠️ Stack

| Tecnologia       | Versão  | Uso            |
| ---------------- | ------- | -------------- |
| **Node.js**      | 24.13.1 | Runtime        |
| **TypeScript**   | Latest  | Type safety    |
| **Express**      | 5.2.1   | Framework HTTP |
| **Prisma**       | 7.4.1   | ORM            |
| **PostgreSQL**   | Latest  | Database       |
| **dotenv**       | 17.3.1  | Env vars       |
| **tsx**          | 4.21.0  | TS executor    |
| **jsonwebtoken** | Planned | Auth JWT       |
| **bcryptjs**     | Planned | Password hash  |
| **node-cron**    | Planned | Jobs agendados |

---

## 📁 Estrutura

```
src/
├── app.ts                      # Express setup
├── server.ts                   # Entry point
├── config/
│   ├── env.ts                  # Load .env
│   └── db.ts                   # Prisma Client
├── modules/                    # Feature modules
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.middleware.ts
│   ├── billing/
│   │   ├── billing.routes.ts
│   │   ├── billing.controller.ts
│   │   ├── billing.service.ts
│   │   ├── billing.guard.ts    # Feature gating + usage checks
│   │   └── billing.types.ts
│   ├── usage/
│   │   ├── usage.service.ts
│   │   └── usage.repo.ts
│   └── plans/
│       ├── plans.service.ts
│       └── plans.repo.ts
├── repos/                      # Data Access Layer
│   ├── user.repo.ts
│   ├── subscription.repo.ts
│   └── billingEvent.repo.ts
├── db/
│   ├── migrations/
│   └── seed.ts
└── shared/                     # Utils
    ├── errors.ts
    ├── http.ts
    ├── logger.ts
    ├── time.ts
    └── validate.ts
```

---

## 🚀 Rodar Localmente

### Pré-requisitos

- Node.js 24+
- PostgreSQL (ou via Docker)

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env (já existe com DATABASE_URL)
# Editar se necessário

# 3. Rodar migrations
npx prisma migrate dev --name init

# 4. Seed dos planos (opcional)
node src/db/seed.ts

# 5. Iniciar servidor
npm run dev
```

Servidor rodando em `http://localhost:3000`

---

## 🐳 Rodar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Executar

```bash
# 1. Clone o repositório
git clone <repo>
cd billing_app

# 2. Configurar .env (se não existir)
cp .env.example .env

# 3. Subir containers (API + PostgreSQL)
docker-compose up -d

# 4. Rodar migrations
docker-compose exec app npx prisma migrate dev --name init

# 5. Seed (opcional)
docker-compose exec app node src/db/seed.ts

# 6. Verificar saúde
curl http://localhost:3000/health
```

### Parar containers

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f app
```

---

## 🔑 Endpoints Principais

```
GET  /health                          # Health check
POST /auth/register                   # Criar usuário
POST /auth/login                      # Login
GET  /plans                           # Listar planos
GET  /me/subscription                 # Status da subscription
POST /billing/change-plan             # Mudar plano
GET  /me/usage                        # Consumo atual
POST /exports/pdf                     # Feature gating example
POST /webhooks/stripe                 # Webhook de pagamento
```

---

## 📝 Licença

ISC
