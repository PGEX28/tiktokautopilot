# Política e Arquitetura de Segurança — TikTok Shop AI Autopilot

## 1. Princípios de Segurança

O sistema adota o modelo de **Defesa em Profundidade (Defense-in-Depth)** com 5 pilares:

1. **Zero Exposição de Segredos no Frontend**: Nenhuma chave de API (OpenAI, TikTok, Supabase Service Role) trafega para o navegador.
2. **Criptografia em Repouso**: Todos os tokens de acesso e de renovação são gravados no banco cifrados com AES-256-GCM.
3. **Proteção Anti-Replay e CSRF**: Estados OAuth de 32 bytes gerados criptograficamente com uso único e expiração curta (15 minutos).
4. **Controle de Acesso RBAC**: Separação de privilégios entre perfis `ADMIN`, `OPERATOR` e `USER`.
5. **Mitigação de Abuso**: Rate limiting global e por IP com cabeçalhos padrão (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).

---

## 2. Padrão Criptográfico (AES-256-GCM)

```text
Texto Puro (Plaintext) ──> [ Chave 256-bit + IV 128-bit ] ──> [ Cifrado + Auth Tag (16-byte) ]
```

* **Algoritmo**: `aes-256-gcm` (Criptografia Autenticada).
* **Vetor de Inicialização (IV)**: 16 bytes pseudo-aleatórios gerados via `crypto.randomBytes()`.
* **Tag de Autenticação**: 16 bytes garantindo que qualquer tentativa de manipulação no banco de dados invalide a decifragem imediatamente.

---

## 3. Cabeçalhos HTTP de Segurança

* `X-Content-Type-Options: nosniff`: Previne MIME-type sniffing.
* `X-Frame-Options: DENY`: Previne ataques de Clickjacking.
* `X-XSS-Protection: 1; mode=block`: Proteção ativa contra Cross-Site Scripting.
* `Strict-Transport-Security`: Força conexões HTTPS em produção.
* Remoção de `X-Powered-By` para não divulgar a stack do servidor.

---

## 4. Gestão de Variáveis e Segredos

No arquivo `.env`:
* `ENCRYPTION_KEY`: Chave hexadecimal de 64 caracteres (32 bytes).
* `JWT_SECRET`: Segredo de alta entropia para sessões.
* `TIKTOK_APP_SECRET`: Chave secreta da aplicação oficial.
