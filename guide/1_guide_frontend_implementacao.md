# Guia: O que foi implementado — Fundação do Frontend

> Documento de referência para a equipe. Explica cada arquivo criado ou alterado, a decisão por trás de cada escolha, e exemplos de código comentados para facilitar o entendimento.

---

## Visão geral

Esta fase construiu a **fundação** — o conjunto de peças que precisa existir antes de qualquer tela ser desenvolvida:

```
types/         → o vocabulário compartilhado com o backend
lib/api/       → como o app fala com a API
store/         → onde o estado global de autenticação vive
hooks/         → como os componentes usam auth
routes/        → quem pode acessar o quê
main.tsx       → configuração global do app
```

---

## 1. `src/types/enums.ts`

### O que é

Define os **valores fixos** que o backend também usa. Quando o backend diz que um usuário tem `role: "admin_loja"`, o frontend precisa saber que esse é um valor válido e como comparar com ele.

### Por que não usar `enum` do TypeScript

O projeto usa Vite com `erasableSyntaxOnly: true`. Essa flag proíbe sintaxe TypeScript que gera código JavaScript — e `enum` gera código. O Vite (esbuild) só consegue _apagar_ tipos, não compilar enums.

```ts
// ❌ Não funciona — gera código JS, bloqueado pelo erasableSyntaxOnly
enum RoleEnum {
  cliente = "cliente",
}

// ✅ Correto — o objeto existe em runtime, o tipo é só apagado
const RoleEnum = {
  cliente: "cliente",
  profissional: "profissional",
  admin_loja: "admin_loja",
} as const;

type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
// O tipo vira: "cliente" | "profissional" | "admin_loja"
```

O `as const` diz ao TypeScript: "trata cada valor como literal, não como string genérica". Sem ele, o tipo seria `{ cliente: string }` — muito largo. Com ele, o tipo é `{ cliente: "cliente" }` — exato.

O truque de exportar `const` e `type` com o mesmo nome permite usar `RoleEnum.cliente` para o valor e `RoleEnum` como tipo — idêntico à experiência de um enum.

### `DiaSemana` — por que é diferente

O backend armazena dias da semana como inteiro (0 = segunda, 6 = domingo), não como string. Por isso `DiaSemana` é um objeto de números, não strings. O `DiaSemanaLabel` serve para exibir "Segunda-feira" na UI sem hardcode nos componentes.

```ts
// Usando na UI:
const label = DiaSemanaLabel[horario.dia_semana]; // "Segunda-feira"
```

---

## 2. `src/types/api.ts`

### O que é

Interfaces TypeScript que descrevem exatamente o formato dos dados que vêm da API. Sem isso, cada arquivo teria que adivinhar o formato — e erros só apareceriam em tempo de execução.

### Tipos auxiliares internos

```ts
type ISOTimestamp = string; // "2026-04-15T09:00:00Z"
type DecimalString = string; // "80.00"
```

São apenas `string` com um nome mais descritivo. O TypeScript não vai checar o formato, mas o nome comunica ao programador o que esperar. O `DecimalString` existe porque o Python serializa `Decimal(10,2)` como string no JSON — se você tentar `Number("80.00")` funciona, mas o tipo `float` poderia perder precisão.

### `ApiError` — dois formatos

O FastAPI retorna erros em dois formatos dependendo do tipo:

```ts
// Erro simples (401, 404, etc.):
{ "detail": "Credenciais inválidas" }

// Erro de validação (422 — campo faltando, formato errado):
{ "detail": [{ "loc": ["body", "email"], "msg": "invalid email", "type": "value_error" }] }
```

A interface cobre os dois:

```ts
interface ApiError {
  detail: string | ValidationError[];
}
```

### `SlotsResponse` — por que ISO timestamps e não "HH:MM"

O contrato original da arquitetura usava strings de hora simples (`"09:00"`). Foi alterado para ISO timestamps completos (`"2026-04-15T09:00:00Z"`).

**Motivo:** quando o usuário seleciona um slot para agendar, o endpoint de criação de agendamento espera o campo `data_hora_inicio` no formato ISO. Com strings simples, o frontend teria que recombinar data + hora + timezone manualmente. Manipulação manual de datas é a principal fonte de bugs de fuso horário.

```ts
// Com "HH:MM" — o frontend precisa montar o timestamp (perigoso):
const dataHoraInicio = `${dataSelecionada}T${slot}:00Z`; // ← zona horária assumida, pode estar errado

// Com ISO timestamp — vai direto para a requisição:
const body = { data_hora_inicio: slot }; // ← simples e correto
```

Para exibir só a hora na UI: `new Date(slot).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })`.

---

## 3. `src/lib/api/auth.ts`

### O que é

As quatro funções que conversam com os endpoints de autenticação da API.

```ts
login(email, password)   → access_token + dados do usuário
register(nome, email, password, role) → mesmo que login
refresh()               → novo access_token (usa o cookie httpOnly automaticamente)
logout()                → invalida o refresh token no servidor
```

### Por que `refresh()` não precisa receber o token

O refresh token vive em um **cookie httpOnly** — uma área do browser que JavaScript não consegue ler, mas que é enviada automaticamente em toda requisição para o mesmo domínio. Por isso o `axios` foi configurado com `withCredentials: true`: diz ao browser para incluir os cookies nas requisições cross-origin.

```ts
// Você não faz isso:
refresh(refreshToken); // ← não temos acesso ao token

// O browser faz sozinho:
// POST /auth/refresh  + Cookie: refresh_token=...
```

### `Exclude<RoleEnum, "admin_loja">` no `RegisterInput`

O cadastro público não cria contas `admin_loja` (isso é feito por fluxo separado). O tipo `Exclude` do TypeScript remove um valor de uma union:

```ts
Exclude<"cliente" | "profissional" | "admin_loja", "admin_loja">;
// resultado: "cliente" | "profissional"
```

---

## 4. `src/store/authStore.ts`

### O que mudou

**Antes:** `accessToken` era salvo no `localStorage` via `persist`.
**Depois:** `accessToken` fica só em memória (Zustand). Só o `user` vai para o `localStorage`.

### Por que `accessToken` não pode ficar no `localStorage`

O `localStorage` é acessível por qualquer JavaScript rodando na página. Se um atacante conseguir injetar código na página (ataque XSS), ele pode roubar o token e fazer requisições como se fosse o usuário.

O `accessToken` em memória desaparece quando o usuário fecha ou recarrega a aba — isso é intencional. O que recupera a sessão é o refresh token, que fica seguro no cookie httpOnly.

### `partialize` — controle fino do que é salvo

```ts
persist(
  (set) => ({ ... }),
  {
    name: "auth-storage",
    partialize: (state) => ({ user: state.user }),
    // ↑ só salva o campo "user" — accessToken nunca toca o disco
  }
)
```

Sem `partialize`, tudo seria salvo. Com ele, você define exatamente o subconjunto que deve persistir.

### As ações disponíveis

```ts
login(token, user); // chamado após login ou register bem-sucedido
logout(); // limpa tudo — chamado no logout e em erros de auth
setAccessToken(token); // chamado pelo interceptor quando o refresh retorna novo token
```

---

## 5. `src/lib/api/axios.ts`

### O que é

O arquivo mais crítico do frontend. É aqui que toda a lógica de autenticação HTTP acontece automaticamente, sem que os componentes precisem se preocupar com tokens.

### Request interceptor

Roda antes de toda requisição sair:

```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

`useAuthStore.getState()` (não o hook `useAuthStore()`) funciona fora de componentes React. É a forma de acessar o estado Zustand em código normal.

### Response interceptor — o fluxo completo

```
Resposta chega
  │
  ├─ Não é 401? → retorna normalmente
  │
  ├─ É 401 e já tentou refresh? → rejeita (evita loop infinito)
  │
  ├─ É 401 em /auth/* ? → logout + redirect (o refresh em si falhou)
  │
  └─ É 401 comum?
       │
       ├─ Não tem refresh em andamento → chama /auth/refresh
       │                                 guarda a promise em `refreshPromise`
       │
       ├─ Já tem refresh em andamento → espera a mesma promise
       │
       ├─ Refresh OK → atualiza token, repete a requisição original
       │
       └─ Refresh falhou → logout + redirect
```

### O refresh lock — por que é necessário

Imagine 3 componentes carregando dados ao mesmo tempo. Se o token expirou, todos recebem 401 simultaneamente. Sem o lock:

```
Request A → 401 → chama /auth/refresh → novo token
Request B → 401 → chama /auth/refresh → erro (token já foi usado)
Request C → 401 → chama /auth/refresh → erro
```

O refresh token é de uso único. Chamá-lo múltiplas vezes causa erros e pode deslogar o usuário sem motivo.

Com o lock:

```ts
let refreshPromise: Promise<string> | null = null

// Request A cria a promise:
refreshPromise = refresh().then(d => d.access_token)

// Request B e C encontram a promise existente e esperam ela:
if (!refreshPromise) { ... } // ← não entra aqui, já existe
const newToken = await refreshPromise // ← espera a mesma promise de A
```

### `window.location.replace` vs `href`

Ao redirecionar para `/login` após falha de auth, usamos `replace` em vez de `href`. A diferença: `replace` não adiciona a página atual no histórico do browser. O usuário não consegue clicar em "voltar" e retornar para uma página protegida que ele não tem mais acesso.

---

## 6. `src/lib/validations/auth.ts`

### O que é

Schemas Zod que definem as regras de validação dos formulários de login e cadastro.

### Por que Zod

O React Hook Form aceita qualquer biblioteca de validação via `zodResolver`. A vantagem do Zod é que você define as regras uma vez e obtém automaticamente: mensagens de erro, tipos TypeScript inferidos, e validação em tempo de execução.

```ts
export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha obrigatória"),
});

// O tipo é inferido automaticamente:
type LoginFormData = z.infer<typeof loginSchema>;
// { email: string; password: string }
```

### `accept_terms` — por que `.refine()`

O `z.literal(true)` aceita apenas o valor exato `true`, mas em Zod v4 a sintaxe para mensagem customizada mudou. O `.refine()` é mais explícito e funciona em qualquer versão:

```ts
accept_terms: z.boolean().refine((val) => val === true, {
  message: "Você deve aceitar os Termos e Condições",
});
```

Isso garante que o checkbox **precisa estar marcado** antes do formulário ser submetido.

---

## 7. `src/hooks/useAuth.ts`

### O que é

Três hooks que encapsulam as mutations de autenticação com TanStack Query. Os componentes de formulário usam esses hooks em vez de chamar a API diretamente.

### Por que TanStack Query para mutations

As mutations do TanStack Query gerenciam automaticamente os estados `isPending`, `isError`, `error` — que os formulários precisam para mostrar loading e mensagens de erro.

```tsx
// No componente de login:
const { mutate: login, isPending, error } = useLogin()

<button disabled={isPending}>
  {isPending ? "Entrando..." : "Entrar"}
</button>

{error && <p>{error.message}</p>}
```

### Redirect por role

Após login bem-sucedido, o usuário vai direto para a área correta:

```ts
function redirectByRole(navigate, role) {
  if (role === "admin_loja") navigate({ to: "/admin/dashboard" });
  if (role === "profissional") navigate({ to: "/profissional/dashboard" });
  else navigate({ to: "/cliente/agendamentos/" });
}
```

A resposta do login inclui `user.role` — o backend sempre retorna o role junto com o token.

### `onSettled` no logout

```ts
useMutation({
  mutationFn: logout,
  onSettled: () => {
    // ← roda mesmo se a API retornar erro
    clearAuth();
    navigate({ to: "/login" });
  },
});
```

`onSettled` garante que mesmo se o servidor retornar erro (ex: já estava deslogado), o estado local é limpo e o usuário vai para o login. `onSuccess` falharia nesse cenário.

---

## 8. Reestruturação das rotas

### O problema original

O TanStack Router usa a **estrutura de pastas** para determinar hierarquia de rotas. Os arquivos `admin/__layout.tsx`, `profissional/__layout.tsx` e `cliente/layout.tsx` eram tratados como rotas normais — não como layouts pai.

Resultado: todas as rotas eram filhas diretas do root, e os guards de autenticação nunca rodavam.

### A convenção correta

| Antes                              | Problema                                      | Depois                    |
| ---------------------------------- | --------------------------------------------- | ------------------------- |
| `routes/admin/__layout.tsx`        | `__layout` não é convenção do TanStack Router | `routes/admin.tsx`        |
| `routes/profissional/__layout.tsx` | Idem                                          | `routes/profissional.tsx` |
| `routes/cliente/layout.tsx`        | Virava rota em `/cliente/layout`              | `routes/cliente.tsx`      |

O par **arquivo `nome.tsx` + pasta `nome/`** é o que o TanStack Router entende como hierarquia:

```
routes/
├── admin.tsx          ← layout pai (path: /admin)
└── admin/
    ├── dashboard.tsx  ← filho (path: /admin/dashboard)
    └── profissionais/
        └── index.tsx  ← filho (path: /admin/profissionais)
```

O router gerou automaticamente `getParentRoute: () => AdminRoute` para todos os filhos após a correção.

### O `beforeLoad` — como funciona o guard

```ts
export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { user, accessToken, setAccessToken, logout } = useAuthStore.getState(); // ← getState(), não o hook — estamos fora de componente

    // 1. Sem usuário → redireciona para login
    if (!user) throw redirect({ to: "/login" });

    // 2. Token sumiu (page reload) → tenta recuperar via cookie
    if (!accessToken) {
      try {
        const data = await refresh();
        setAccessToken(data.access_token);
      } catch {
        logout();
        throw redirect({ to: "/login" });
      }
    }

    // 3. Role errado → redireciona para home
    if (user.role !== "admin_loja") throw redirect({ to: "/" });
  },
});
```

O `beforeLoad` roda **antes de renderizar qualquer componente** da rota. Se lançar um `redirect`, a navegação é abortada e o usuário é redirecionado. Os filhos (`/admin/dashboard`, etc.) herdam esse guard automaticamente.

O cenário "token sumiu mas usuário existe" é o **reload de página**: o `accessToken` fica só em memória (desaparece no reload), mas o `user` persiste no `localStorage`. Nesse caso o refresh token ainda está no cookie, então o refresh silencioso recupera a sessão sem pedir login.

---

## 9. `src/main.tsx` — QueryClient configurado

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // sem retry automático em erros
      staleTime: 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Por que `retry: false`

O padrão do TanStack Query é tentar 3 vezes em caso de erro — incluindo 401. Sem essa configuração, um token expirado causaria 3 chamadas antes de o interceptor do axios agir. Com `retry: false`, o interceptor trata o 401 na primeira tentativa.

### `staleTime: 60_000`

Por padrão, o TanStack Query considera todos os dados "velhos" assim que chegam — e refaz a requisição toda vez que o componente monta. `staleTime: 60_000` significa: "os dados são considerados frescos por 1 minuto, não busca de novo antes disso". Evita requisições desnecessárias ao navegar entre telas.

---

## Fluxo completo de autenticação

Para visualizar como tudo se encaixa:

### Login

```
Usuário preenche o formulário
  → useLogin() dispara a mutation
    → login() chama POST /auth/login
      → Backend retorna { access_token, user } + Set-Cookie: refresh_token
        → authStore.login(token, user) — salva em memória + localStorage (só user)
          → redirect para dashboard correto por role
```

### Requisição autenticada

```
Componente usa um hook de query
  → TanStack Query chama a função de API
    → axios request interceptor injeta Authorization: Bearer {token}
      → Backend processa e retorna dados
```

### Token expirado (401)

```
Requisição retorna 401
  → axios response interceptor detecta
    → Se já tem refresh em andamento: espera a mesma promise
    → Se não tem: chama POST /auth/refresh (cookie vai automaticamente)
      → Backend retorna novo access_token
        → authStore.setAccessToken(newToken)
          → Requisição original é repetida com novo token
            → Componente recebe os dados normalmente (sem saber que houve refresh)
```

### Reload de página

```
Usuário recarrega
  → accessToken some da memória
  → user ainda existe no localStorage
  → Usuário navega para rota protegida
    → beforeLoad detecta: user existe, accessToken null
      → Chama refresh() silenciosamente
        → accessToken restaurado
          → Rota renderiza normalmente
```

### Refresh expirado (sessão encerrada)

```
refresh() retorna 401
  → authStore.logout() — limpa tudo
  → window.location.replace("/login") — sem histórico de volta
```

---

## Resumo dos arquivos

| Arquivo                       | Status     | Função                                             |
| ----------------------------- | ---------- | -------------------------------------------------- |
| `src/types/enums.ts`          | Criado     | Enums espelhando o backend                         |
| `src/types/api.ts`            | Criado     | Interfaces de todos os DTOs da API                 |
| `src/lib/api/auth.ts`         | Criado     | Funções login/register/refresh/logout              |
| `src/store/authStore.ts`      | Reescrito  | Estado de auth — token em memória, user persistido |
| `src/lib/api/axios.ts`        | Reescrito  | Interceptors com refresh lock                      |
| `src/lib/validations/auth.ts` | Criado     | Schemas Zod para formulários                       |
| `src/hooks/useAuth.ts`        | Criado     | Hooks de mutation com redirect por role            |
| `src/routes/admin.tsx`        | Criado     | Layout com guard (role: admin_loja)                |
| `src/routes/profissional.tsx` | Criado     | Layout com guard (role: profissional)              |
| `src/routes/cliente.tsx`      | Criado     | Layout com guard (role: cliente)                   |
| `src/routes/__root.tsx`       | Atualizado | Layout raiz limpo, devtools só em dev              |
| `src/main.tsx`                | Atualizado | QueryClient com retry: false                       |
| `docs/arquitetura_mvp.md`     | Atualizado | Contrato de slots corrigido para ISO timestamps    |

**Arquivos deletados:**

- `src/routes/admin/__layout.tsx`
- `src/routes/profissional/__layout.tsx`
- `src/routes/cliente/layout.tsx`
