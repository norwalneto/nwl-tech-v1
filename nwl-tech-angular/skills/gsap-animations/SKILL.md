---
name: gsap-animations
description: GSAP, ScrollTrigger, timeline ou animação com vazamento — crie timelines, entradas e transições integradas ao ciclo de vida Angular
---

# GSAP Animations (Angular + TypeScript)

Crie e mantenha animações GSAP/ScrollTrigger/Lenis integradas ao ciclo de vida Angular 21 sem vazar listeners ou frames.

## Quando usar

- Criar timelines de entrada (hero, títulos, CTAs) com `gsap.timeline`.
- Adicionar ou ajustar `ScrollTrigger` com `scrub` para reveals de seções, cards e etapas.
- Implementar microinterações (hover assistido por GSAP, parallax discreto, pulsos).
- Diagnosticar animações travadas, flicker, jank de scroll ou vazamento ao navegar/destruir componentes.
- Integrar `Lenis` ao `gsap.ticker` e `ScrollTrigger.update`.

## Procedimento

### 1. Inspecionar o padrão existente antes de animar

- Leia `src/app/app.ts` (Lenis + `gsap.context` + `ScrollTrigger` com `scrub` 0.9–1, `isPlatformBrowser`, `AfterViewInit`/`OnDestroy`) e `src/app/components/hero/hero.component.ts` (timeline de entrada ~3 s, `data-hero-*`, `gsap.to` com `repeat: -1`).
- Confirme `package.json`: `gsap@^3.15.0`, `lenis@^1.3.26`, `gsap/ScrollTrigger` registrado uma vez com `gsap.registerPlugin(ScrollTrigger)`.
- Anote seletores usados (`[data-scroll-reveal]`, `[data-card-stagger] .service`, `[data-process-stagger] .process-step`, `[data-contact-stagger] [data-contact-link]`, `.hero` para parallax) e tokens de tempo/easing já empregados.
- **Critério:** inventário de animações, seletores e timings documentado sem alterar código.

### 2. Definir escopo mínimo da animação

- Escolha 1 alvo por vez (ex.: hero, `process-steps` ou `contact-links`) e descreva trigger, alvo, propriedades animadas, easing e duração visual (0.5–0.8 s por reveal, stagger 0.1–0.18).
- Prefira `autoAlpha` + `y`/`x` + `rotationX`/`scale` (compositáveis); evite animar `blur`, `filter` intenso ou `box-shadow` simultâneos.
- Defina `start`/`end` do ScrollTrigger (ex.: `top 90%` → `top 54%`) e se deve ser reversível ao subir.
- **Critério:** escopo escrito com seletor, trigger, easing e impacto no scroll descritos.

### 3. Integrar ao ciclo de vida Angular corretamente

- Toda animação Web/GSAP atrás de `isPlatformBrowser`; crie em `ngAfterViewInit`, nunca no construtor.
- Encapsule tudo em `gsap.context(() => { ... }, this.host)` onde `host` é `ElementRef<HTMLElement>.nativeElement`; guarde o contexto em campo privado.
- Registre `ScrollTrigger` uma vez; crie triggers dentro do contexto para que `context.revert()` os mate automaticamente.
- Para Lenis: `new Lenis({ autoRaf: false, anchors: true, smoothWheel: true, lerp: 0.085 })`, `lenis.on('scroll', ...)` → `ScrollTrigger.update`, `gsap.ticker.add(onGsapTick)` onde `onGsapTick` chama `lenis.raf(timeMs)`, `gsap.ticker.lagSmoothing(0)` ao iniciar.
- **Critério:** animação só roda no browser, escopada ao host e sem `gsap.*` fora de contexto.

### 4. Implementar timeline/ScrollTrigger sem quebrar o existente

- Entrada (sem scroll): use `gsap.timeline({ defaults: { ease: 'power3.out' } })` com `fromTo` encadeados e sobreposição (`'-=0.2'`, `'<+0.07'`). Exemplo hero: aura → partículas (stagger 0.1) → eyebrow → linhas (stagger 0.1, `power4.out`) → descrição → CTAs (stagger 0.12) → nota.
- Scroll-linked: `gsap.fromTo(el, { autoAlpha:0, y:44 }, { autoAlpha:1, y:0, scrollTrigger:{ trigger: el, start:'top 90%', end:'top 56%', scrub: 0.9 } })`; para grids, `stagger` dentro do `fromTo` do ScrollTrigger.
- Parallax: `gsap.to('[data-hero-aura]', { yPercent:-22, scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1.2 } })`.
- Loops ambiente: `repeat:-1`, `yoyo:true`, `ease:'sine.inOut'` com duração longa (10–11 s); nunca combine `scrub` com `repeat`.
- Após criar triggers dinâmicos, chame `ScrollTrigger.refresh()` uma vez ao final de `startMotion`.
- **Critério:** timeline/trigger respeita easing e durações do projeto, sem conflito com `translate` de `:hover` (mantenha `translate` separado do `transform` do GSAP quando necessário).

### 5. Limpeza, performance e verificação

- Em `ngOnDestroy`: `animationContext?.revert()` (mata timelines e ScrollTriggers do escopo), `gsap.ticker.remove(onGsapTick)`, `stopLenisListening?.()`, `lenis.destroy()`, `gsap.ticker.lagSmoothing(500,33)` para restaurar padrão; no `connectivity-scene` também `cancelAnimationFrame`, `disconnect` observers e `removeEventListener('visibilitychange')`.
- Não reintroduza `prefers-reduced-motion` para encurtar animações — o projeto atual mantém animações sempre ativas, pausando apenas por `IntersectionObserver`/`document.hidden` na cena 3D; documente qualquer exceção antes de condicionar animação a media query.
- Use `will-change` apenas nos elementos realmente animados (`transform`, `opacity`) e remova após entrada se não houver loop.
- **Critério:** ao destruir o componente, nenhum ticker, listener ou ScrollTrigger permanece; `npm run build` passa sem erros.

## Critérios de qualidade

- Nenhum `gsap.to/from` fora de `gsap.context`; nenhum `ScrollTrigger.create` sem `trigger` e `start`/`end` explícitos.
- Timings alinhados ao projeto: entrada hero ~3 s, reveals 0.5–0.8 s, stagger 0.1–0.18, scrub 0.9–1.2.
- Lenis `lerp` 0.085 e `lagSmoothing(0)` durante scroll suave; restaurado ao destruir.
- Sem vazamento: 0 listeners órfãos após `ngOnDestroy`.

## Erros a evitar

- Importar `ScrollTrigger` sem `gsap.registerPlugin(ScrollTrigger)` ou registrar múltiplas vezes.
- Criar `new Lenis({ autoRaf:true })` junto com `gsap.ticker` (duplica rAF).
- Esquecer `isPlatformBrowser` e quebrar SSR/build.
- Animação fora de `gsap.context` e sem `revert` — causa vazamento ao trocar rota ou destruir componente.
- Usar `animation` CSS e GSAP concorrentes no mesmo elemento sem suspender um deles.
- `scrub` com `duration`/`repeat` conflitantes ou `stagger` excessivo (>0.2) que atrasa demais a leitura.

## Verificação

- `npm run build` sem erros; nenhum `GSAP target not found` no console.
- Destruir e recriar o componente (navegar) não duplica triggers — `ScrollTrigger.getAll().length` estável.
- Scroll sobe e desce com reveals reversíveis e parallax suave; Lenis atualiza ScrollTrigger a cada tick.
