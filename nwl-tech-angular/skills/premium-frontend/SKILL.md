---
name: premium-frontend
description: Design premium, identidade visual ou tipografia desalinhada — aplique acabamento visual, responsividade e microinterações no Angular
---

# Premium Frontend

Aplique acabamento premium a páginas Angular existentes sem redesenhar o site.

## Quando usar

- Ajustes de hierarquia, espaçamento, tipografia e paleta antes de mexer no layout.
- Revisão de responsividade, estados de hover/focus e microinterações.
- Qualquer pedido de "deixar mais premium", "mais alinhado" ou "mais sofisticado".

## Procedimento

### 1. Auditar tokens existentes

- Leia `src/styles.css` e liste `:root` tokens (`--bg`, `--green`, `--line`, `--content-width`, `--page-gutter`), breakpoints (1080/760/560/460) e famílias tipográficas (Manrope).
- Anote onde cada token é usado antes de propor mudança.
- **Critério:** inventário de tokens e breakpoints documentado sem alterar arquivos.

### 2. Definir escopo visual mínimo

- Escolha 1–2 alvos (ex.: hero, cards, header) e descreva o problema visual com evidência (print, medida ou classe).
- Não proponha redesign global; preserve a identidade NWL (azul-marinho base, verde `#a0ef58`/`#c4ff83` apenas para ação).
- **Critério:** escopo escrito com antes/depois esperado e arquivos afetados listados.

### 3. Aplicar acabamento com CSS existente

- Ajuste espaçamento, tipografia, borda, sombra e transições reutilizando tokens. Prefira `clamp()`, `gap` e `perspective` já usados.
- Tipografia: respeite `letter-spacing` negativo em títulos e `line-height` 1.4–1.9 do projeto; não troque Manrope sem motivo.
- **Critério:** estilos compilam e mantêm contraste e ritmo vertical nos breakpoints existentes.

### 4. Responsividade e estados

- Verifique 320, 360, 390, 760 e 1080 px. Garanta `min-width: 320px`, `overflow-x: hidden` e grid quebrando para 1–2 colunas como em `.service-grid`.
- Revise `:hover`, `:focus-visible` (outline 3px `var(--green)`), `:active` e `prefers-reduced-motion` se aplicável.
- **Critério:** layout sem overflow horizontal e foco visível em todos os interativos.

### 5. Acessibilidade e acabamento

- Confirme contraste AA para texto sobre `--bg`/`--surface`, `alt` em imagens, `aria-label` em navegação e `skip` link funcional.
- Valide seleção (`::selection`), `text-wrap: balance` em títulos e `will-change` apenas onde há animação real.
- **Critério:** checklist de a11y preenchido sem regressão visual.

## Critérios de qualidade

- Nenhum token novo sem justificativa; reutilizar variáveis existentes quando possível.
- Transições em `0.2–0.38s` com `cubic-bezier(0.22, 0.61, 0.36, 1)` alinhadas ao `styles.css` atual.
- Sombras e bordas sutis (`rgb(177 193 217 / 15%)`, `inset 0 1px rgb(255 255 255 / 2%)`).

## Erros a evitar

- Trocar paleta ou tipografia base sem aprovação.
- Adicionar biblioteca CSS nova (Tailwind, Bootstrap) — este projeto usa CSS puro.
- Usar `!important` para corrigir especificidade.
- Alterar `public/assets/nwl-logo*.png|webp` ou redesenhar a logo.

## Verificação

- `npm run build` sem erros e inspeção visual em 320 px e 1280 px.
- Nenhum `console.error` e nenhum layout shift acima de 0.1 em Lighthouse (se disponível).
