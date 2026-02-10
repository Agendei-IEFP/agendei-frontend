# 🐾 Patas Sem Lar — Frontend MVP

Frontend da plataforma **Patas Sem Lar**, uma aplicação web voltada para divulgação de animais disponíveis para adoção por associações e protetores independentes.

O objetivo do projeto é sensibilizar pessoas sobre a importância da adoção responsável e facilitar a conexão entre interessados e associações de animais.

---

## 🎯 Objetivo do MVP

O MVP (Minimum Viable Product) tem como foco principal:

- Exibir animais disponíveis para adoção
- Permitir visualização detalhada das informações dos animais
- Permitir autenticação de usuários
- Permitir que associações criem e gerenciem posts

---

## 🧱 Stack Tecnológica

- **React**
- **Axios**
- **TailwindCSS** (ou outra biblioteca de estilização)
- Integração com API backend em **Java + Spring Boot**

---

## 🌍 Estrutura de Rotas

### 🔓 Rotas Públicas

| Rota | Descrição |
|------|------------|
| `/` | Landing page institucional |
| `/explorar` | Mostruário de animais disponíveis |
| `/explorar/:id` | Página de detalhe do animal |
| `/login` | Login |
| `/register` | Registro |

---

### 🔐 Rotas Protegidas

| Rota | Acesso | Descrição |
|------|--------|------------|
| `/profile` | Usuário autenticado | Perfil do usuário |
| `/association/dashboard` | Associação | Gerenciar posts |
| `/association/posts/new` | Associação | Criar novo post |
| `/association/posts/:id/edit` | Associação | Editar post |

---

## 🧩 Componentes Principais

- `Header`
- `HeroLanding`
- `AnimalCard`
- `AnimalGrid`
- `FilterBar`
- `AnimalDetail`
- `LoginForm`
- `RegisterForm`
- `PostForm`
- `PhotoUploader`
- `AdoptionRequestModal`
- `ProtectedRoute`

---

## 🔎 Funcionalidades do MVP

### 🏠 Landing Page
- Texto institucional
- Call-to-action para explorar animais
- Seção explicando importância da adoção

### 🐶 Mostruário de Animais
- Grid de cards
- Exibição de:
  - Foto principal
  - Nome do animal
  - Cidade/Região
  - Status (Disponível / Adotado)
- Filtros básicos:
  - Espécie
  - Cidade
  - Porte
  - Idade

### 📄 Página de Detalhe
- Galeria de fotos
- Descrição completa
- Informações da associação
- Botão “Manifestar Interesse”

### 🔐 Autenticação
- Registro
- Login
- Logout
- Persistência de token
- Rotas protegidas

### 🏢 Área da Associação
- Criar post
- Editar post
- Remover post
- Upload de fotos

### 💌 Manifestação de Interesse
- Usuário autenticado pode enviar mensagem
- Feedback visual após envio

---

## 🔌 Integração com API

Base URL:
- POST /auth/login
- POST /auth/register
- GET /posts
- GET /posts/{id}
- POST /posts
- PUT /posts/{id}
- DELETE /posts/{id}
- POST /posts/{id}/adoption-requests
