# Agendei — Frontend

Interface web da plataforma de agendamento para salões de beleza. Permite que donos de salão gerenciem lojas e profissionais, profissionais gerenciem sua agenda e serviços, e clientes façam agendamentos online.

## Stack

- **React 19** + **TypeScript**
- **Vite 7** — bundler e dev server
- **TanStack Router** — roteamento file-based com code splitting automático
- **TanStack Query** — cache e sincronização de dados do servidor
- **Zustand** — estado global do cliente (auth, booking flow, UI)
- **Tailwind CSS v4** + **shadcn/ui** — design system
- **React Hook Form** + **Zod** — formulários e validação
- **Axios** — cliente HTTP com interceptors de auth

## Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:8000` (ver `../backend/`)

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

O Vite sobe em `http://localhost:5173` e faz proxy de `/api/*` para `http://localhost:8000` automaticamente — não é necessário configurar variáveis de ambiente para desenvolvimento local.

## Scripts

| Comando            | O que faz                                 |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Inicia o dev server com HMR               |
| `npm run build`    | Type-check + build de produção em `dist/` |
| `npm run preview`  | Serve o build de produção localmente      |
| `npm run prettier` | Roda o linter de estilização do código    |
| `npm run lint`     | Roda ESLint                               |

## Estrutura

```
src/
├── components/
│   ├── ui/          # Primitivos shadcn — sem lógica de negócio
│   ├── shared/      # Componentes reutilizáveis (LoadingSpinner, EmptyState…)
│   ├── layout/      # Navbar, Sidebar, PageContainer
│   └── {feature}/   # Componentes específicos por domínio
├── hooks/           # Hooks TanStack Query, um arquivo por domínio
├── lib/
│   ├── api/         # Funções async puras por recurso
│   └── validations/ # Schemas Zod por entidade
├── routes/          # Rotas file-based do TanStack Router
├── store/           # Stores Zustand
└── types/           # DTOs e enums compartilhados
```

## Rotas

| Caminho                   | Papel        | Descrição                                              |
| ------------------------- | ------------ | ------------------------------------------------------ |
| `/`                       | público      | Landing page                                           |
| `/login`                  | público      | Login                                                  |
| `/register`               | público      | Cadastro de cliente                                    |
| `/stores`                 | público      | Lista de lojas                                         |
| `/stores/:storeId`        | público      | Página da loja                                         |
| `/stores/:storeId/book`   | cliente      | Fluxo de agendamento (serviço → horário → confirmação) |
| `/admin/dashboard`        | admin        | Visão geral da loja                                    |
| `/admin/store/edit`       | admin        | Editar dados da loja                                   |
| `/admin/professionals`    | admin        | Gerenciar profissionais                                |
| `/professional/dashboard` | profissional | Visão geral do profissional                            |
| `/professional/services`  | profissional | Gerenciar serviços                                     |
| `/professional/schedules` | profissional | Configurar horários de trabalho                        |
| `/client/appointments`    | cliente      | Meus agendamentos                                      |
| `/client/account`         | cliente      | Conta do cliente                                       |

## Auth

A autenticação usa dois tokens:

- **Access token** — armazenado em memória (Zustand), enviado como `Bearer` header
- **Refresh token** — cookie httpOnly, enviado automaticamente pelo browser

O interceptor do Axios renova o access token silenciosamente ao receber um `401`, enfileirando as requisições paralelas para evitar múltiplas chamadas ao `/auth/refresh`.
