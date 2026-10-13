---
name: threejs-expert
description: Cena Three.js, WebGL, globo ou logo 3D no Angular — crie e otimize geometria, materiais, iluminação e performance sem alterar a identidade da logo
---

# Three.js Expert (Angular + TypeScript)

Integre e evolua a cena 3D do projeto preservando a logo NWL existente.

## Quando usar

- Alterar `src/app/components/connectivity-scene/` (globo, órbitas, nós, textura da logo).
- Diagnosticar WebGL, fallback CSS, ResizeObserver ou IntersectionObserver da cena.
- Otimizar performance WebGL, pixel ratio, toneMapping ou render loop em Angular 21.

## Procedimento

### 1. Inspecionar a cena atual antes de tocar no código

- Leia `connectivity-scene.component.ts`, `.html` e `.css`; anote renderer, câmera, lights, grupos `world`/`globe`, `orbitPulses` e fallback `.scene-fallback-art`.
- Verifique `package.json`: `three@^0.186.1`, `@types/three@^0.186.0`, carregamento sob demanda via `import('three')`.
- Confirme assets: `public/assets/nwl-logo-cutout.webp` (textura), `nwl-logo.png` preservado intacto.
- **Critério:** inventário da cena documentado sem alterar a identidade visual da logo.

### 2. Preservar a logo — regra inegociável

- Nunca substituir `nwl-logo.png`/`nwl-logo-cutout.*` por outra marca nem redesenhar a logo. A textura é mapeada em `PlaneGeometry` curvado no núcleo; mantenha `alphaTest`, `depthWrite: false` e `toneMapped: false`.
- Ajustes permitidos: escala, curvatura (`PlaneGeometry` 48x48), posição `z`, `anisotropy` e timing de entrada. Não criar letras extrudadas individuais.
- **Critério:** logo segue idêntica à arte original; nenhuma alteração de cor, forma ou tipografia da marca.

### 3. Planejar mudança 3D com escopo mínimo

- Defina 1 objetivo (ex.: contraste do grid, halo de órbita, densidade de nós) e liste objetos afetados (`SphereGeometry`, `LineSegments`, `TorusGeometry`, `TubeGeometry`, `TextureLoader`).
- Verifique SSR: toda WebGL deve estar atrás de `isPlatformBrowser` e `ngAfterViewInit`; `ngOnDestroy` deve desconectar observers e `renderer.dispose()`.
- **Critério:** escopo escrito com arquivos, materiais e impacto em bundle sob demanda descritos.

### 4. Implementar com integração Angular correta

- Mantenha import dinâmico `await import('three')`; não mover `three` para bundle inicial.
- Renderer: `alpha: true`, `antialias: true`, `powerPreference: 'high-performance'`, `setPixelRatio(min(devicePixelRatio, 1.5))`, `SRGBColorSpace`, `ACESFilmicToneMapping` com `exposure 1.18`.
- Câmera `PerspectiveCamera(34, 1, 0.1, 80)`, `z` 8.6 / 9.2 (<560 px); `ResizeObserver` atualiza `setSize` e `aspect`.
- Iluminação: `AmbientLight(0x8eece0, 1.65)` + dois `PointLight`; não adicionar novos lights sem medir custo.
- Animação em `requestAnimationFrame` com `delta` clampado a 0.05s, pausa via `IntersectionObserver` e `document.hidden`; `globe.rotation.y = elapsed * 2PI / 34`.
- **Critério:** cena renderiza sem vazamento de frame, sem `THREE` no bundle principal e sem erro em SSR.

### 5. Performance, fallback e verificação

- Reutilize geometrias/materiais quando possível; evite recalcular opacidade por frame após entrada. Limite `LineSegments` e `TorusGeometry(..., 180)` ao necessário.
- Fallback CSS (`scene-fallback-globe`, orbs) deve permanecer funcional; classe `scene-fallback` / `scene-logo-unavailable` cobre falha de `import('three')`.
- **Critério:** `npm run build` sem erros, bloco `three` segue sob demanda (~742 kB bruto), sem regressão em 320 px e sem travamento em `prefers-reduced-motion`.

## Critérios de qualidade

- Logo NWL intacta; nenhuma nova dependência além de `three`/`@types/three` já instaladas.
- Frame budget <16 ms em desktop; partículas e halos com `will-change` apenas onde animados.
- Limpeza completa em `ngOnDestroy`: `cancelAnimationFrame`, `disconnect` observers, `removeEventListener('visibilitychange')`.

## Erros a evitar

- Import estático `import * as THREE from 'three'` no topo (quebra code-splitting).
- Criar nova logo, trocar cores da marca ou aplicar `MeshStandardMaterial` opaco sobre a textura.
- Esquecer `isPlatformBrowser` ou deixar `requestAnimationFrame` rodando fora da tela / aba oculta.
- Aumentar `devicePixelRatio` sem teto ou adicionar geometrias de alta resolução sem medir.
- Remover fallback CSS ou quebrar `scene-ready` / `scene-fallback-art`.

## Verificação

- `npm run build` passa; `three` não aparece em `initial` chunks.
- Inspecionar `dist/` contém `nwl-logo-cutout.webp`; canvas com `opacity` 0→1 via `scene-ready`.
- Testar redimensionamento e `document.hidden` pausando o loop.
