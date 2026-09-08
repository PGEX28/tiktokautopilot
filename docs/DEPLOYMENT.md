# Guia de Deploy e Operação em Produção

Este guia detalha as estratégias de implantação do **TikTok Shop AI Autopilot** em ambientes corporativos e de alta escala.

---

## 🐳 Opção 1: Deploy com Docker Compose (Servidor Dedicado / VPS)

Ideal para instâncias em VPS (Hetzner, DigitalOcean, AWS EC2, GCP Compute Engine).

### 1. Clonar e Configurar o `.env`
```bash
cp .env.example .env
# Edite as chaves de API, credenciais do Supabase e tokens do TikTok
```

### 2. Subir os Containers
```bash
docker compose up -d --build
```

### 3. Verificar Saúde dos Serviços
```bash
docker compose ps
docker compose logs -f api
```

---

## ☁️ Opção 2: Deploy Desacoplado (Vercel + Supabase + Redis Cloud)

- **Frontend (`apps/web`)**: Deploy estático direto na Vercel ou Cloudflare Pages apontando o diretório raiz para `apps/web`.
- **Backend API (`apps/api`)**: Deploy em container no AWS ECS, Google Cloud Run ou Render com imagem base contendo `ffmpeg`.
- **Banco de Dados**: Instância gerenciada Supabase com migrations aplicadas (`infrastructure/supabase/migrations/001_initial_schema.sql`).
- **Fila BullMQ**: Instância Upstash Redis ou Redis Labs.

---

## 🔒 Checklist de Segurança em Produção

- [x] Chave `ENCRYPTION_KEY` definida com 64 caracteres hexadecimais (32 bytes).
- [x] `JWT_SECRET` forte configurado.
- [x] Trava de emergência `BUDGET_GUARD_DAILY_LIMIT` ativa com teto prudente.
- [x] SSL/TLS ativado e cabeçalhos de segurança HTTP ativos.
