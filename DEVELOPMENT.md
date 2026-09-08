# Development Guide — TikTok Shop AI Autopilot

## 1. Prerequisites

* **Node.js**: >= 20.11.0 LTS
* **npm**: >= 10.0.0
* **Docker & Docker Compose** (Optional for local PostgreSQL and Redis)
* **FFmpeg**: Installed and accessible in your system `PATH` for video processing stages.

---

## 2. Local Environment Setup

1. **Clone the Repository**:
   ```bash
   git clone <repo-url>
   cd "projeto tiktok"
   ```

2. **Install Root and Workspace Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Verify Type Definitions across all packages**:
   ```bash
   npm run typecheck
   ```

---

## 3. Running Services Locally

### Development Mode (All Services)
```bash
npm run dev
```

### Run Specific Services
* **Backend API only**:
  ```bash
  npm run dev:api
  ```
* **Frontend Web Dashboard only**:
  ```bash
  npm run dev:web
  ```

---

## 4. Code Standards & Quality Checks

* **Linting**:
  ```bash
  npm run lint
  ```
* **Formatting**:
  ```bash
  npm run format
  ```
* **Automated Tests**:
  ```bash
  npm run test
  ```

---

## 5. Development Conventions

* Always import shared types from `@autopilot/shared`.
* Do not call third-party APIs directly in controllers; utilize Provider interfaces.
* Validate all incoming request payloads with Zod schemas.
* Handle both `DEMO` and `PRODUCTION` execution modes seamlessly.
