# Changelog — NWL Soluções Tecnológicas

## Abertura, responsividade e SEO — 13/10/2026

- Criada uma abertura animada que espera a aplicação e o globo (ou o fallback) antes de revelar a página.
- Ativada a geração estática e a hidratação do Angular; o HTML principal fica disponível já na publicação.
- Acrescentados canonical, Open Graph, Twitter Card, dados estruturados, `robots.txt` e sitemap para `nwltecnologia.site`.
- Refinados cabeçalho, cartões, contatos e pontos de quebra para telas estreitas; GSAP e Lenis carregam após o primeiro quadro.
- Mantido o visual e o movimento normal do globo; a preferência do sistema por menos movimento reduz a velocidade.

## Linhas do globo em movimento contínuo — 10/10/2026

- Adicionadas três linhas luminosas sobre a malha 3D; elas percorrem a superfície da esfera em ciclos contínuos de 27 s, em sentido independente do giro principal de 34 s.
- Incluídas duas linhas animadas no fallback CSS para manter o movimento visível enquanto WebGL carrega ou quando não está disponível.
- Atualizados o README e `melhorias.md` para explicar os movimentos da esfera e das linhas.

### Verificação

`npm run build` concluiu sem erros. O pacote inicial ficou em 277,34 kB bruto (86,58 kB transferidos); Three.js permanece sob demanda, com 742,24 kB bruto (155,21 kB transferidos).

Este arquivo descreve o propósito do projeto, como os arquivos estão organizados e as alterações feitas na estrutura Angular.

## Sobre o projeto

Site institucional de página única da NWL Soluções Tecnológicas. A página apresenta a empresa, cinco áreas de serviço — câmeras de segurança, redes e Wi-Fi, cabeamento estruturado, suporte em computadores e criação de sites — e formas de contato por WhatsApp, e-mail e Instagram.

Os botões do WhatsApp abrem uma conversa com uma mensagem sugerida. O site é estático: não tem formulário, backend, banco de dados nem envio automático de mensagens.

## Organização dos arquivos

```text
src/
├── app/
│   ├── app.config.ts          # Providers e configuração global
│   ├── app.html               # Estrutura da página
│   ├── app.ts                 # Componente raiz e composição
│   ├── components/            # Cabeçalho, hero, serviços, contato e rodapé
│   └── data/site-content.ts   # Contatos e criação de links do WhatsApp
├── index.html                 # Metadados e elemento raiz do Angular
├── main.ts                    # Ponto de entrada e bootstrap standalone
└── styles.css                 # Estilos globais, layout e responsividade

public/assets/nwl-logo.png          # Arte original da NWL, mantida intacta
public/assets/nwl-logo-cutout.png   # Recorte transparente de referência
public/assets/nwl-logo-cutout.webp  # Textura otimizada usada na cena 3D
tools/extract_logo_alpha.ps1        # Regenera o recorte usando a arte original
```

O componente `App` importa diretamente os componentes de cada seção. Cada componente declara `standalone: true` e `ChangeDetectionStrategy.OnPush`. A página usa navegação por âncoras; por isso, não precisa de `NgModule` ou de configuração de rotas.

## Alterações — 10/10/2026

- Alinhados os arquivos do componente raiz aos nomes usados pela estrutura standalone atual do Angular: `app.ts` e `app.html`.
- Adicionado `app.config.ts` para centralizar os providers e registrar os listeners globais de erro do navegador.
- Atualizado `main.ts` para inicializar `App` com `bootstrapApplication` e a configuração central.
- Definidos padrões do workspace para novos componentes standalone com `OnPush` e CSS.
- Removidos imports e propriedades de contato que não eram usados nos componentes de cabeçalho, hero, serviços e rodapé.
- Reorganizados os templates para facilitar manutenção. A faixa de áreas de atuação agora é uma lista semântica; o ano de copyright do rodapé é atualizado automaticamente.
- Atualizado o README com os novos caminhos de arquivos e um resumo da arquitetura.

## Refinamento visual e cena 3D — 10/10/2026

- Criado o componente standalone `connectivity-scene` com Three.js para ilustrar conexões e infraestrutura de rede, mantendo a logo original como elemento principal da hero.
- Carregado Three.js sob demanda para manter a cena fora do pacote inicial. O carregamento do 3D não bloqueia o conteúdo nem os contatos.
- Adicionado fallback CSS para WebGL indisponível ou contexto perdido, ajuste ao redimensionamento, pausa fora da tela ou com a aba oculta e liberação de recursos ao destruir o componente.
- Respeitada a preferência `prefers-reduced-motion` tanto na cena quanto nas animações CSS.
- Reforçada a movimentação após revisão: em ciclo de 4,8 s, a logo flutua 32 px e aumenta até 5,5% em escala uniforme; a malha gira continuamente e dois pontos luminosos percorrem as órbitas em cerca de 10 a 14 s.
- Renovados tipografia, espaçamentos, estados de foco e hover, cabeçalho fixo com transparência e layouts para telas menores, mantendo a paleta azul-marinho e verde da NWL.
- Atualizados o README e este histórico com a organização da cena e suas condições de execução.

### Verificação da atualização

`npm run build` concluiu sem erros e sem avisos de orçamento. O pacote inicial ficou em aproximadamente 139 kB; Three.js foi isolado em um bloco sob demanda. O build gerou os recursos em `dist/`.

A revisão visual automatizada no navegador não foi concluída porque não havia navegador disponível na sessão de Computer Use. O build e a inspeção de responsividade no código foram concluídos; a apresentação final em um navegador ainda deve ser conferida localmente.

### Verificação

`npm run build` concluiu com sucesso em 10/10/2026. O build validou os templates e o TypeScript em modo estrito e gerou os arquivos de produção em `dist/`.

## Animações GSAP e rolagem — 10/10/2026

- Substituída a animação CSS genérica por uma sequência GSAP na hero: brilho ambiente e partículas surgem primeiro; a logo aparece por uma máscara; um feixe de luz cruza a imagem; título, descrição e chamada entram em sequência.
- Incluído movimento CSS de reserva para a logo se o JavaScript de animação não iniciar; ele é suspenso quando o GSAP assume e também respeita `prefers-reduced-motion`.
- Mantida a PNG original da NWL sem edição. A animação trata a logo como uma única imagem e combina flutuação contínua com parallax discreto pelo ponteiro em dispositivos com mouse.
- Integrado ScrollTrigger para revelar a faixa de áreas, os títulos das seções e o contato ao rolar a página; os seis cartões de serviço entram em sequência.
- Integrado Lenis à atualização do ticker GSAP e ao ScrollTrigger, com navegação suave pelas âncoras. O modo de movimento reduzido conserva a rolagem nativa e desativa as animações GSAP.
- Adicionados contextos GSAP por componente, remoção de listeners, destruição do Lenis e restauração do ticker ao encerrar; a preferência de movimento é observada também quando muda durante a sessão.
- Atualizados os estilos da hero e o README para documentar as dependências e como a sequência funciona.

### Verificação da atualização de animações

`npm run build` concluiu com sucesso em 10/10/2026, sem erros nem avisos. O pacote inicial de produção ficou em aproximadamente 281 kB bruto (88 kB transferidos); Three.js continua em um bloco sob demanda de aproximadamente 742 kB bruto (155 kB transferidos). A revisão visual no navegador não foi possível nesta sessão: Computer Use não detectou navegadores conectados. A instância local em `http://localhost:4200` foi consultada e estava servindo o JavaScript e o CSS atualizados.

## Revisão de presença 3D e scroll — 10/10/2026

- Alongada a materialização da logo: ela parte inclinada em perspectiva, desfocada e distante, depois se aproxima e ganha nitidez ao longo de 2,65 s.
- Mantida a logo em movimento depois da entrada: balanço 3D contínuo de 9,6 s por ciclo, flutuação vertical e resposta ao scroll; o brilho ambiente e as partículas também continuam em ciclos longos.
- Corrigida a composição da cena Three.js: a logo agora mescla com o fundo luminoso da cena, deixando visíveis a malha e as órbitas. Aumentado o contraste da esfera e dos caminhos orbitais.
- Criado movimento 3D CSS para as órbitas do fallback quando WebGL não puder ser usado.
- Alteradas as animações de seção, cartões e contatos para acompanhar o progresso do scroll (`scrub`), com perspectiva e reversão suave ao subir a página.
- Separada a elevação de hover dos cartões do transform GSAP para que os dois efeitos funcionem juntos.
- Verificado com `npm run build`: pacote inicial aproximado de 282 kB bruto (88 kB transferidos); Three.js segue sob demanda em cerca de 742 kB bruto (155 kB transferidos).

## Correção da rotação contínua e movimento visível — 10/10/2026

- Centralizado o controle de movimento em `MotionPreferenceService` e conectado a ele o globo Three.js, a hero e as animações globais de scroll. Antes, o globo ainda consultava a configuração do sistema separadamente e podia permanecer parado enquanto o restante do site animava.
- As animações agora começam ligadas conforme solicitado. O botão na hero pausa ou retoma a rotação 3D, o movimento da logo, o scroll suave e as animações de seção; a escolha fica salva neste navegador.
- Desacelerada a malha do globo para uma volta completa em cerca de 39 s. Os marcadores levam aproximadamente 18 s e 23 s por volta, e o fallback CSS também gira em ciclos longos e contínuos.
- Alongado o movimento ambiente da logo para ciclos de 17,6 s, mantendo sua materialização de entrada e o brilho. As revelações de scroll permanecem ligadas ao avanço e ao retorno da rolagem.
- Atualizado o README com o comportamento do controle e os arquivos responsáveis pela cena 3D e pelo movimento.

### Verificação desta correção

`npm run build` concluiu sem erros em 10/10/2026. O pacote inicial ficou em aproximadamente 289 kB bruto (90 kB transferidos), e Three.js permaneceu em um bloco sob demanda de 742 kB bruto (155 kB transferidos). Tentei abrir `http://localhost:4200` para revisão visual, mas esta sessão não disponibilizou navegador; a inspeção visual continua pendente.

## Animações sempre ativas — 10/10/2026

- Removido da hero o botão de ativar/pausar a animação, conforme solicitado.
- Removido o controle de preferência manual e a regra CSS que encurtava animações quando o sistema usa movimento reduzido; a rotação do globo, o movimento da logo, as órbitas, o Lenis e as animações por scroll iniciam automaticamente.
- Mantida a pausa técnica da cena 3D enquanto ela está fora da tela ou a aba está oculta. Ao voltar à hero, a rotação contínua retoma.
- Mantidos ciclos mais longos: cerca de 39 s por volta do globo e 18 a 23 s para os nós orbitais. A materialização inicial termina, mas o movimento da marca e do globo continua enquanto a página está ativa.
- Atualizado o README para refletir o funcionamento permanente das animações.

### Verificação desta alteração

`npm run build` concluiu sem erros em 10/10/2026. O pacote inicial ficou em aproximadamente 281 kB bruto (88 kB transferidos), e Three.js permaneceu em um bloco sob demanda de 742 kB bruto (155 kB transferidos). A inspeção visual ainda depende de um navegador disponível na sessão; tentei abrir o preview local, mas nenhum navegador estava disponível.

## Logo com volume 3D — 10/10/2026

- Inspecionado o arquivo original: embora se chame `nwl-logo.png`, o conteúdo é JPEG RGB com o fundo azul-marinho incorporado. O original foi preservado.
- Criado `tools/extract_logo_alpha.ps1` para remover o fundo escuro, preservar os detalhes claros e verdes e gerar o recorte transparente `public/assets/nwl-logo-cutout.png` (545 × 574).
- Substituída a imagem HTML que apenas inclinava a logo por uma textura transparente em sete faces Three.js empilhadas no eixo de profundidade, formando um objeto com volume na cena 3D.
- A logo entra girando quase uma volta completa e se materializa em 5,8 s. Depois, inclina e flutua em ciclos contínuos; o globo e as órbitas permanecem visíveis por trás das áreas transparentes.
- Mantida uma animação CSS para a logo quando WebGL não estiver disponível. A animação GSAP da hero continua cuidando do texto, da luz ambiente e das partículas.
- Atualizado o README com o formato real do arquivo original, o processo de recorte e a localização da cena 3D.

### Verificação da logo 3D

`npm run build` concluiu sem erros em 10/10/2026. O pacote inicial ficou em aproximadamente 280 kB bruto (88 kB transferidos); Three.js permaneceu em um bloco sob demanda de 742 kB bruto (155 kB transferidos). O recorte transparente foi conferido sobre um fundo colorido. A inspeção da cena ao vivo continua pendente porque nenhum navegador estava disponível na sessão.

## Integração da marca ao globo e abertura mais rápida — 10/10/2026

- Removida a placa plana que deixava a logo visualmente solta à frente do globo. A textura agora acompanha a curvatura da esfera em uma malha 3D com camadas de relevo.
- Adicionadas faces frontal e traseira com orientação de leitura correta. A logo e o globo giram no mesmo grupo 3D, formando uma única peça.
- Recomposta a versão CSS de reserva com a marca centralizada sobre a esfera, para manter a composição unificada enquanto Three.js carrega ou se WebGL não estiver disponível.
- Adiado o carregamento do bloco Three.js por 180 ms para permitir que a primeira pintura da página apareça antes do trabalho da cena.
- Reduzida a materialização inicial da logo de 5,8 s para 1,7 s; a rotação da peça continua em ciclo lento de cerca de 39 s.
- Encurtada a sequência de entrada do texto e das chamadas da hero para apresentar o conteúdo mais cedo, mantendo as luzes, partículas e movimento ambiente contínuos.
- Convertida a textura RGBA para WebP de alta qualidade: o arquivo usado na página caiu de 455.819 para 82.004 bytes (82% menor), sem adicionar uma dependência ao projeto.
- Atualizado o README com a composição curva e o comportamento de carregamento.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 281,28 kB bruto (88,32 kB transferidos); Three.js continua em bloco sob demanda com 155,21 kB estimados de transferência. A compilação também copiou a textura WebP para `dist/assets/`.

## Abertura mais rápida e marca equilibrada — 10/10/2026

- Reduzida a área da textura da NWL na esfera e suavizado seu relevo para deixar o globo de conexões mais evidente. Adicionado um núcleo translúcido para reforçar o volume da esfera.
- Acelerada a entrada da marca para cerca de 1,25 s e a rotação contínua do globo para uma volta em cerca de 27 s. O fallback CSS acompanha o novo tamanho e ritmo.
- Encurtadas as animações da hero e do scroll; o Lenis responde com menos atraso. O menu agora indica se a seção de serviços ou contato está ativa.
- Incluída a ação secundária **“Conhecer soluções”** na hero e uma faixa de três passos neutros entre os serviços e o contato.
- Reduzido o tamanho máximo da cena em telas menores, sem remover a esfera animada.
- Movidos os links da fonte Manrope para o `head` com preconexão, retirando a solicitação externa via `@import` do CSS.
- Atualizados o README e `melhorias.md` para documentar as alterações e os próximos pontos que dependem de fotos ou informações reais da NWL.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 285,29 kB bruto (89,13 kB transferidos); Three.js permaneceu em bloco sob demanda, com 155,21 kB estimados de transferência.

## Ritmo suave e órbitas de dados — 10/10/2026

- Alongada a materialização da marca para cerca de 1,95 s e desacelerada a rotação contínua do globo para aproximadamente 37 s por volta.
- Adicionadas três órbitas em inclinações e velocidades distintas, além de quatro trajetos curvos com pulsos luminosos que percorrem a rede.
- Espaçada a sequência de entrada da hero para cerca de 3 s e estendidos os ciclos ambiente das partículas e do brilho.
- Dado ao botão principal um brilho de baixa intensidade em ciclo de 5,2 s e ampliado para 0,38 s o tempo das transições de interação.
- Suavizada a rolagem e ampliado o percurso de revelação das seções, cartões e contatos.
- Atualizados este changelog, o README e `melhorias.md` com o novo ritmo e a representação visual da rede.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 287,26 kB bruto (89,66 kB transferidos); Three.js permaneceu em bloco sob demanda, com 155,21 kB estimados de transferência.

## Medalhão da marca inspirado na referência — 10/10/2026

- Reorganizada a cena para colocar a logo original no centro de um medalhão metálico 3D, com aro externo, filete luminoso, marcações radiais e pequenos nós.
- Usada a imagem enviada como referência de estilo para o núcleo circular e a rede orbital; a arte da marca continua sendo o asset próprio da NWL.
- Adensada a malha esférica e mantidos os três anéis orbitais e os arcos de dados animados.
- Aplicado o mesmo medalhão ao fallback CSS para preservar a composição enquanto WebGL carrega ou quando não está disponível.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 289,09 kB bruto (89,98 kB transferidos); Three.js permaneceu em bloco sob demanda, com 155,21 kB estimados de transferência.

## Imagem de referência aplicada diretamente — 10/10/2026

- Substituída a releitura em medalhão pela arte completa enviada: o globo de dados com o NWL centralizado agora aparece como na referência.
- Convertido o JPG de 818 kB para `public/assets/nwl-network-reference.webp`, com 281 kB, preservando a composição e as cores.
- Adicionada entrada CSS 3D de 2,3 s e inclinação contínua discreta de 18 s para manter a imagem em movimento.
- Removida a cena procedural anterior e retirada temporariamente a dependência de Three.js.
- Atualizados o README e `melhorias.md` para registrar o uso direto da imagem e seus tempos de animação.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 263,19 kB bruto (82,45 kB transferidos); a imagem de referência é servida como asset WebP separado, sem gerar um bloco Three.js.

## Arte de referência transformada em objeto 3D — 10/10/2026

- Mantida a imagem inteira como face visível do objeto e aplicada sobre uma malha subdividida em 220 × 111 segmentos.
- Convertida a luminosidade dos pixels em relevo geométrico, dando volume às áreas claras do globo e dos raios sem redesenhar a arte.
- Criada uma moldura metálica arredondada com geometria extrudada, espessura física e contorno iluminado.
- Reintroduzido Three.js sob demanda para materializar a peça em 2,35 s e mantê-la em movimento 3D contínuo e suave.
- Preservada a mesma imagem animada em CSS enquanto o WebGL carrega ou quando não está disponível.

### Verificação desta revisão

`npm run build` concluiu sem erros. O pacote inicial ficou em 281,96 kB bruto (88,41 kB transferidos); Three.js continua em bloco sob demanda, com 742,24 kB bruto (155,21 kB transferidos).

## Retorno à imagem de referência — 10/10/2026

- Desfeita a tentativa de criar relevo geométrico e moldura 3D para a arte enviada.
- Restaurada a imagem completa na hero, com entrada CSS de cerca de 2,3 s e balanço discreto contínuo em ciclo de 18 s.
- Removida novamente a dependência Three.js e simplificado o componente da cena para exibir a imagem diretamente.
- Corrigidos o README e `melhorias.md` para descreverem a versão restaurada.

### Verificação desta alteração

`npm run build` concluiu sem erros. O pacote inicial ficou em 263,19 kB bruto (82,45 kB transferidos), sem bloco Three.js.

## Rotação isolada no globo — 10/10/2026

- Separada a esfera com grade, nós e rotas do núcleo da logo e das órbitas externas.
- Aplicada a rotação contínua somente à esfera, com uma volta em 34 s; a marca e as órbitas permanecem fixas.
- Retirado o movimento dos pulsos e das órbitas para deixar o giro do globo claramente visível.
- Mantida a rotação do fallback CSS em repetição contínua, sem reduzi-la a uma única passagem conforme a preferência do sistema.

### Verificação

`npm run build` concluiu sem erros; Three.js continua sob demanda.

## Refinamento visual das órbitas — 10/10/2026

- Reforçadas as linhas dos três círculos com halos suaves e espessuras diferentes.
- Adicionados pontos luminosos que percorrem cada órbita em velocidades e fases distintas, com pulsação leve.
- Mantidos os círculos no lugar e a rotação axial do globo separada da marca central.
- Atualizado o fallback CSS com pontos de luz em movimento para os ambientes sem WebGL.

### Verificação

`npm run build` concluiu sem erros. O pacote inicial ficou em 274,93 kB bruto (86,09 kB transferidos); Three.js continua em bloco sob demanda com 742,24 kB bruto (155,21 kB transferidos).

## Globo de conectividade 3D restaurado — 10/10/2026

- Restaurada a cena de rede que existia antes da arte completa de referência ocupar a hero.
- Recriados em Three.js a esfera com meridianos e paralelos, os nós luminosos, as rotas de dados e três órbitas inclinadas.
- Integrada a logo original ao núcleo em uma superfície curva; a logo continua sendo uma textura 2D, enquanto o globo, as órbitas, o núcleo e os marcadores têm geometria 3D.
- Mantida a cena em Three.js sob demanda, com entrada de 1,45 s e fallback CSS sem WebGL.
- Ajustada a proporção da área da hero para acomodar a esfera e documentada a diferença entre a cena modelada e a arte de referência guardada como consulta.

### Verificação desta restauração

`npm run build` concluiu sem erros. O pacote inicial ficou em 273,34 kB bruto (85,80 kB transferidos); Three.js permaneceu em bloco sob demanda com 742,24 kB bruto (155,21 kB transferidos).

### Referências Angular

- [Estrutura de arquivos do Angular](https://angular.dev/reference/configs/file-structure)
- [bootstrapApplication](https://angular.dev/api/platform-browser/bootstrapApplication)
- [provideBrowserGlobalErrorListeners](https://angular.dev/api/core/provideBrowserGlobalErrorListeners)
