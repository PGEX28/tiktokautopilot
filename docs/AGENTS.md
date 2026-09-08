# Guia dos Agentes Autônomos de IA — TikTok Shop AI Autopilot

## 1. Visão Geral da Arquitetura dos Agentes

Cada agente no sistema opera como um serviço isolado com ciclo de vida rigoroso:
```text
Entrada (Input) ──> Validação ──> Processamento Heurístico/IA ──> Saída Estruturada ──> Auditoria no Banco / Fila
```

---

## 2. Product Hunter Agent (Fase 3 / Etapa 5)

### Responsabilidade
Descobrir produtos físicos reais com alto potencial de tração no TikTok Shop e viabilidade de afiliação, sem alucinar métricas ou inventar dados inexistentes.

### Interface Central
```typescript
ProductHunter.findCandidates(query?: ProductHunterQuery): Promise<ProductHunterResult>
```

---

## 3. Product Score Agent (Fase 4 / Etapa 6)

### Responsabilidade
Calcular a viabilidade quantitativa e qualitativa de produtos candidatos em uma escala de 0 a 100 pontos, baseando-se em 8 dimensões ponderadas, classificando em tiers e explicando as razões das notas.

### Critérios de Pontuação e Pesos Oficiais

$$\text{Score Total} = \sum (\text{Nota Bruta}_i \times \text{Peso}_i)$$

| # | Critério | Chave | Peso | Descrição |
|---|---|---|---|---|
| 1 | **Demanda** | `demand` | **25% (0.25)** | Velocidade de vendas e volume mensal |
| 2 | **Potencial Viral** | `viralPotential` | **20% (0.20)** | Retenção visual nos primeiros 3s e gancho magnético |
| 3 | **Comissão** | `commission` | **15% (0.15)** | Porcentagem e margem líquida por unidade |
| 4 | **Preço** | `price` | **10% (0.10)** | Ajuste à faixa de compra por impulso ($15 - $60) |
| 5 | **Avaliações** | `reviews` | **10% (0.10)** | Nota média de estrelas e prova social |
| 6 | **Concorrência** | `competition` | **10% (0.10)** | Saturação do nicho e espaço para novos ângulos |
| 7 | **Demonstração** | `demonstrability` | **5% (0.05)** | Clareza de exibição visual imediata |
| 8 | **Compra por Impulso** | `impulseBuy` | **5% (0.05)** | Decisão rápida sem atrito de consideração |

---

### Classificação Estratégica (Tiers)

* **90 a 100 — EXCELENTE**: Prioridade máxima para produção no Autopilot.
* **80 a 89 — FORTE**: Alta viabilidade, recomendado para variações A/B/C.
* **70 a 79 — TESTAR**: Exige testes preliminares com ganchos alternativos.
* **60 a 69 — FRACO**: Margem ou apelo baixos, requer revisão manual.
* **0 a 59 — DESCARTAR**: Produto inviável para campanhas em vídeo.

---

### Explicação e Disclaimer Obrigatório
O agente sempre responde:
* Justificativa detalhada de cada critério com nota bruta e nota ponderada.
* Lista de prós, contras e riscos.
* Aviso legal de que a nota reflete estimativa estatística de potencial criativo/comercial e nunca garantia de vendas.
