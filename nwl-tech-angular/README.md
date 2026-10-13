# NWL — site institucional em Angular

Projeto Angular 21 com componentes standalone, TypeScript e CSS. A página é pré-gerada como HTML estático e hidratada no navegador, para abrir rápido e deixar o conteúdo disponível aos buscadores. Inclui a logo original da NWL, as cinco áreas de serviço e contatos por WhatsApp, Instagram e e-mail.

A hero mantém o globo de conectividade 3D com meridianos, paralelos, nós, rotas e órbitas. A esfera gira em ciclo de 22 s; duas linhas luminosas percorrem a superfície em 17 s, e a logo original acompanha a rotação sobre a esfera. Three.js carrega sob demanda, com uma composição CSS animada como reserva para aparelhos sem WebGL. Uma abertura animada cobre a inicialização e desaparece quando a página está pronta; o conteúdo permanece disponível se os efeitos falharem.

## Executar no VS Code / Windows

1. Instale o Node.js 24 LTS, se ainda não estiver instalado.
2. Extraia o ZIP e abra a pasta `nwl-tech-angular` no VS Code.
3. No terminal dessa pasta (a que contém `package.json`), execute:

```bash
npm ci
npm start
```

Abra **http://localhost:4200**. Não é necessário instalar o Angular CLI globalmente: os comandos utilizam a versão incluída no projeto.

## Gerar a versão de produção

```bash
npm run build
```

O resultado estático fica em `dist/browser/`. Publique o conteúdo dessa pasta em uma hospedagem para sites estáticos. O projeto não precisa de um servidor Java ou de banco de dados.

Para hospedar em uma subpasta, por exemplo `/nwl/`:

```bash
npm run build -- --base-href /nwl/
```

## Onde editar

| O que você quer alterar | Arquivo |
| --- | --- |
| Inicialização da aplicação | `src/main.ts` |
| Providers e configuração global | `src/app/app.config.ts` |
| Composição da página e GSAP/Lenis/ScrollTrigger | `src/app/app.ts` e `src/app/app.html` |
| Cena de conectividade da hero | `src/app/components/connectivity-scene/` |
| WhatsApp, e-mail e Instagram | `src/app/data/site-content.ts` |
| Menu e marca no cabeçalho | `src/app/components/header/header.component.html` |
| Entrada do texto e luz ambiente da hero | `src/app/components/hero/hero.component.ts` |
| Arte de referência e animação da hero | `src/app/components/connectivity-scene/` |
| Descrições dos serviços | `src/app/components/services/services.component.html` |
| Área de contato | `src/app/components/contact/contact.component.html` |
| Rodapé | `src/app/components/footer/footer.component.html` |
| Cores, layout, responsividade e camadas visuais da animação | `src/styles.css` |
| Imagem original da logo (preservada) | `public/assets/nwl-logo.png` |
| Arte completa enviada, guardada como referência visual | `public/assets/nwl-network-reference.webp` |
| Recorte PNG transparente de referência | `public/assets/nwl-logo-cutout.png` |
| Textura WebP otimizada da logo recortada | `public/assets/nwl-logo-cutout.webp` |
| Gerar novamente o recorte no Windows | `tools/extract_logo_alpha.ps1` |
| Título, descrição, dados estruturados e prévias sociais | `src/index.html` |
| Regras para rastreadores e sitemap | `public/robots.txt`, `public/sitemap.xml` |

## Estrutura standalone

`src/main.ts` inicializa a aplicação com `bootstrapApplication`. `src/app/app.config.ts` concentra os providers do navegador; a configuração de servidor gera HTML estático para a página e a hidrata no navegador. Como o site tem uma única página com navegação por âncoras, ele não precisa de navegação por rotas no cliente.

A hero monta a esfera e os caminhos em geometria 3D; a logo é a textura original da NWL aplicada sobre uma malha curva no núcleo, sem extrusão individual das letras. A imagem completa da referência enviada continua guardada em `public/assets/nwl-network-reference.webp` como material de consulta. O arquivo original da logo NWL continua disponível para cabeçalho e outros usos. A abertura oferece acesso direto ao orçamento ou às soluções; depois dos serviços, uma faixa resume como iniciar o contato. O menu indica seções ativas, Lenis suaviza a rolagem e as revelações acompanham o scroll por uma distância maior. GSAP ScrollTrigger liga revelações, cartões, etapas e contatos ao progresso do scroll, com movimento reversível ao rolar para cima.

O histórico desta organização e das alterações recentes está em [`CHANGELOG.md`](CHANGELOG.md).

As propostas para as próximas melhorias visuais e de animação estão em [`melhorias.md`](melhorias.md).

Os links do WhatsApp são calculados por `whatsappUrl()` e codificam as mensagens automaticamente. Eles abrem o WhatsApp; nenhuma mensagem é enviada automaticamente. Não há formulário, coleta de dados, rastreamento ou backend neste projeto.

## Dependências e validação

- Angular 21.2 com geração estática e hidratação, TypeScript 5.9 e RxJS 7.8.
- GSAP 3.15 com ScrollTrigger, Lenis 1.3 e Three.js 0.186 (cena carregada sob demanda).
- `package-lock.json` incluído para instalação reproduzível com `npm ci`.
- Compilação de produção valida TypeScript e os templates com modo estrito.
- A fonte Manrope é carregada do Google Fonts; se não estiver disponível, o site utiliza Arial.
- O domínio público configurado para canonical, sitemap e prévias sociais é `https://nwltecnologia.site/`.
- Compatibilidade oficial de versões: https://angular.dev/reference/versions

O ZIP contém o código-fonte e os recursos necessários. `node_modules`, caches, credenciais e configurações da hospedagem privada não são incluídos.
