---
name: frontend-audit
description: Auditoria frontend, diagnóstico visual ou build com falha — analise componentes, estilos, logo, acessibilidade, responsividade e performance no Angular
---

# Frontend Audit

Audite o projeto NWL existente sem alterar componentes de produção; entregue diagnóstico priorizado e plano mínimo de correção.

## Quando usar

- Auditar componentes, templates, `styles.css` e assets antes de qualquer refatoração.
- Diagnosticar logo `nwl-logo-cutout.webp` (textura vs. fallback) sem alterar a identidade visual.
- Verificar acessibilidade, responsividade, performance ou falha de `npm run build`.
- Gerar checklist pré-deploy ou validar se mudanças visuais/técnicas introduziram regressão.

## Procedimento

### 1. Inspecionar sem alterar

- Leia `package.json` (Angular 21, TypeScript 5.9, three/gsap/lenis), `angular.json` (standalone, OnPush, budgets), `tsconfig.json`, `src/styles.css` (`:root` tokens, breakpoints 1080/760/560/460), `src/index.html` e `public/assets/` (logo intacta).
- Liste `src/app/` (app.ts/html/config, components/header/hero/connectivity-scene/services/contact/footer, data/site-content.ts) e `tools/` sem editar.
- **Critério:** inventário de estrutura, dependências e assets registrado; nenhum arquivo de produção alterado.

### 2. Auditar componentes e estilos

- Para cada componente standalone: verifique `ChangeDetectionStrategy.OnPush`, `standalone:true`, template/SCSS alinhados ao `styles.css` e ausência de imports não usados.
- Em `styles.css`: mapeie tokens (`--bg`, `--green`, `--line`, `--content-width`, `--page-gutter`), `clamp()`, `perspective`, transições e estados `:hover`/`:focus-visible`; sinalize duplicação ou token órfão.
- Em `connectivity-scene`: confirme import dinâmico `import('three')` fora do bundle inicial e fallback `.scene-fallback-art` funcional.
- **Critério:** tabela componente → achados (ok/atencao/critico) com arquivo e linha ou classe citada.

### 3. Diagnosticar a logo

- Confirme `public/assets/nwl-logo.png` original intacto e `nwl-logo-cutout.webp` como textura em `PlaneGeometry` curvado (48x48, `alphaTest 0.02`, `depthWrite:false`, `toneMapped:false`); não proponha nova logo ou troca de cor/tipografia.
- Verifique `TextureLoader` com `anisotropy`, `SRGBColorSpace` e tratamento de falha (`scene-logo-unavailable`); fallback CSS deve exibir globo + logo estática.
- **Critério:** diagnóstico da logo registra preservação da identidade e cobre WebGL ok vs. fallback; nenhuma alteração proposta à arte da marca.

### 4. Acessibilidade

- Cheque `skip` link, `aria-label` em navegação, `alt`/aria em imagens, contraste AA sobre `--bg`/`--surface`, ordem de foco, `focus-visible` (outline 3px `var(--green)`) e `aria-current` no menu.
- Valide semântica: lista `principles` como `<ul>`, `services` como `<article>`, headings em ordem e `lang="pt-BR"`.
- **Critério:** checklist a11y preenchido com evidência (seletor ou print) e severidade por item.

### 5. Responsividade

- Inspecione 320, 360, 390, 760 e 1080 px: `min-width:320px`, `overflow-x:hidden`, `hero` em 1 coluna <760 px, `service-grid` 3→2→1 colunas, `header` com `brand-sub` oculto em mobile, `hero-logo` centralizado.
- Confirme `scroll-padding-top` (112/92 px) e que animações GSAP não causam overflow horizontal.
- **Critério:** nenhum overflow horizontal e breakpoints conferidos com captura ou medida registrada.

### 6. Performance e build

- Não instale dependências novas. Rode `npm run build` (valida TypeScript strict + templates) e anote budgets: initial ~500 kB warning / 1 MB error; three deve permanecer em chunk sob demanda (~155 kB transfer).
- Sinalize `will-change` apenas onde há animação real, `setPixelRatio` limitado a 1.5 e `ResizeObserver`/`IntersectionObserver` com `disconnect` em `ngOnDestroy`.
- **Critério:** build sem erros; se houver warning de budget ou chunk indevido, registrado com tamanho e arquivo.

### 7. Consolidar diagnóstico

- Classifique achados em crítico / atenção / sugestão e proponha plano mínimo (1–3 próximos passos) sem redesenhar o site ou reescrever componentes.
- Não invente métricas: cite apenas o que foi medido (build log, tamanhos, Lighthouse se disponível, inspeção de código).
- **Critério:** relatório final lista achados priorizados, evidências e próximos passos sem alterar código de produção.

## Critérios de qualidade

- Zero alterações em `src/` ou `public/` durante a auditoria; apenas leitura e relatório.
- Cada achado cita arquivo real e critério (token, breakpoint, bundle, a11y).
- Logo NWL tratada como intocável; qualquer ajuste futuro apenas em escala/curvatura/posição, nunca na arte.

## Erros a evitar

- Editar componentes, `styles.css` ou assets durante a auditoria.
- Propor nova biblioteca (Tailwind, UI kit) sem medir contra CSS puro existente.
- Atribuir severidade sem evidência ou inventar resultados de build/testes.
- Ignorar `isPlatformBrowser`/`ngOnDestroy` ao avaliar GSAP/Three.js.
- Sugerir redesign global quando o escopo pede acabamento pontual.

## Verificação

- `npm run build` executado e log anexado ao relatório (ou motivo da indisponibilidade registrado).
- Relatório revisável: cada seção (componentes, estilos, logo, a11y, responsivo, performance) com status ok/atencao/critico.
- Nenhum arquivo de produção modificado — `git status` limpo exceto relatório.
