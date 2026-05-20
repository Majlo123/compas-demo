# Compas Demo

## 📋 Project Overview

This is a full-stack web application for managing par levels and warnings. The project uses a modern technology stack with TypeScript, React, and Express, containerized with Docker.

## 🏗️ Project Architecture

### Backend (Layered architecture)
- **Routes Layer**: HTTP request routing and validation
- **Controllers Layer**: Request/response handling, orchestration
- **Services Layer**: Business logic
- **Repositories Layer**: Data access and persistence

### Frontend (Component-based architecture)
- **Pages**: Top-level page components with routing
- **Components**: Reusable UI components
- **Stores (Zustand)**: Global state management
- **Services**: API communication and business logic
- **Hooks**: Custom React hooks for reusable logic

## 🛠️ Technology Stack

### Backend Stack
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Express.js](https://expressjs.com/) 4.18 - Web application framework
- **Language**: TypeScript 5.2
- **Validation**: [Zod](https://zod.dev/) 3.24 - Schema validation
- **Documentation**: Swagger/OpenAPI (swagger-jsdoc + swagger-ui-express)
- **Security**: 
  - Helmet.js (HTTP headers)
  - JWT (jsonwebtoken)
  - CORS

### Frontend Stack
- **Framework**: [React](https://react.dev/) 18 - UI library
- **Language**: TypeScript 5
- **Build Tool**: [Vite](https://vitejs.dev/) 7.1 - Next generation frontend tooling
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) 3.3 - Utility-first CSS framework
  - SASS/SCSS
  - PostCSS

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- Git (for cloning the repository)

### 1. Clone the Repository
```bash
git clone https://github.com/2C-Solution/compas-demo
cd compas-demo
```

### 2. Running the Development Environment

#### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker compose up -d --build

# Check service status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 3. Running Storybook (Frontend)

To develop UI components in isolation:

```bash
cd deploy/frontend
bun install  # Install dependencies if not already done
bun run storybook
```

Access Storybook at [http://localhost:6006](http://localhost:6006).

### 3. Environment Variables

The project uses `.env` files for configuration:

- **Backend**: `deploy/tools/env/backend.dev.env`
- **Frontend**: `deploy/tools/env/frontend.dev.env`

Adjust these files according to your environment needs (database credentials, API keys, etc.)
