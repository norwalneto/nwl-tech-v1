# Melhorias visuais e de animação — NWL

Este documento reúne sugestões para as próximas evoluções do site. As ideias foram pensadas para a identidade atual — fundo azul-marinho, verde como cor de ação, serviços de tecnologia e contato direto — e complementam o que já existe em `src/styles.css`, na hero, na cena 3D e nas animações de scroll.

## Aplicado nesta revisão

- Tela de abertura animada com a logo original, órbitas suaves e barra de progresso indeterminada; ela fecha quando a página e o globo (ou o fallback CSS) ficam prontos, com tempo limite de segurança.
- Angular configurado para pré-gerar a página como HTML estático e hidratá-la no navegador, melhorando a leitura por buscadores e prévias sociais.
- Metadados em português, dados estruturados Organization/WebSite/WebPage, canonical, Open Graph, Twitter Card, `robots.txt` e `sitemap.xml` para `nwltecnologia.site`.
- GSAP e Lenis passaram a ser carregados após o primeiro quadro, para liberar o conteúdo antes das animações de rolagem.
- Cabeçalho em vidro fosco, cartões de serviço com hierarquia visual mais clara e contatos com estados de interação refinados.
- Ajuste específico de cabeçalho e espaçamento abaixo de 380 px; animações da interface consideram `prefers-reduced-motion`.
- Abertura com ação principal para orçamento e ação secundária **“Conhecer soluções”**.
- Nova faixa **“Como começar”** entre serviços e contato, com três passos diretos.
- Esfera de conectividade em geometria 3D, com grade mais sutil de meridianos e paralelos, nós luminosos e duas órbitas inclinadas.
- Logo original aplicada como textura curva diretamente na superfície esférica. Ela gira junto com o globo; o disco e o aro que davam aparência de medalhão foram removidos.
- Globo com entrada de cerca de 0,5 s e rotação contínua em ciclo de 22 s. Os pontos luminosos percorrem as órbitas em velocidades diferentes.
- Duas linhas luminosas percorrem a superfície em ciclo contínuo de 17 s. O fallback CSS também mantém a logo sobre a esfera em movimento.
- Three.js carrega sob demanda e a textura da logo é pré-carregada. O fallback aparece durante o carregamento com um indicador discreto; se o WebGL não iniciar, a versão CSS continua animada.
- A sequência de texto e ações da hero dura cerca de 3 s.
- Botão principal com brilho leve em ciclo de 5,2 s; interações têm transições mais graduais.
- Scroll com Lenis mais suave e revelações distribuídas por um trecho maior da rolagem.

Fotos de projetos, depoimentos, clientes, região atendida e horários continuam dependendo de informações e materiais reais da NWL.

## Prioridades

| Prioridade | Melhoria | Resultado esperado |
| --- | --- | --- |
| Alta | Validar a nova ação da hero que leva às soluções | Mais caminhos claros para quem ainda não quer pedir orçamento |
| Alta | Mostrar projetos reais e como a NWL trabalha | Mais contexto e confiança antes do contato |
| Alta | Conferir a composição da hero em telas pequenas | Conteúdo principal e chamada aparecem sem uma rolagem longa |
| Média | Dar ritmo visual próprio a cada seção | A página deixa de parecer uma sequência de blocos com o mesmo fundo |
| Média | Conferir a composição do globo em telas pequenas | A esfera e a logo continuam legíveis sem ocupar a hero inteira |
| Média | Conferir as animações de scroll em celular | Movimento mais consistente em aparelhos modestos |

## Melhorias visuais

### 1. Validar as ações da abertura

A hero agora tem a ação principal para orçamento e o link **“Conhecer soluções”**, apontando para `#servicos`. Conferir em celular se os dois botões quebram de linha com bom espaçamento e se o botão de orçamento continua sendo o mais destacado.

**Arquivos:** `src/app/components/hero/hero.component.html`, `src/styles.css`.

### 2. Mostrar trabalho real da NWL

Criar uma área curta de projetos com fotos de instalações, redes, câmeras ou sites entregues. Uma legenda deve explicar o desafio e a solução em uma frase. Usar somente projetos e imagens autorizados; não preencher essa área com números, clientes ou depoimentos inventados.

**Resultado esperado:** a pessoa entende o tipo de trabalho feito antes de abrir o WhatsApp.

### 3. Explicar o processo de atendimento

A faixa **“Como começar”** já resume três passos neutros: contar a necessidade, alinhar opções e definir como seguir. Confirmar com a NWL que o texto representa corretamente o atendimento antes de publicar.

**Arquivos:** `src/app/app.html`, novo componente standalone ou uma seção de serviços, `src/styles.css`.

### 4. Separar melhor as seções

Manter o azul-marinho como base, mas alternar áreas com variações sutis de superfície, gradientes localizados e divisores finos. Reservar o verde vivo para ações, números e pontos importantes. Isso dá ritmo sem acrescentar mais brilho à página toda.

**Arquivo:** `src/styles.css`.

### 5. Fortalecer os cartões de serviço

Os cinco cartões já têm ícones próprios. Uma próxima revisão pode alinhar melhor a altura dos títulos e descrições, dar mais destaque ao benefício de cada serviço e tornar a área clicável mais evidente. Fotos pequenas de projetos podem entrar depois, se houver material real; os ícones atuais são uma boa opção enquanto isso.

**Arquivos:** `src/app/components/services/services.component.html`, `src/styles.css`.

### 6. Ajustar o enquadramento no celular

Em telas estreitas, revisar o espaço vertical ocupado pelo globo abaixo do texto. O título e o botão principal devem continuar fáceis de encontrar; reduzir o tamanho da cena em celulares menores pode trazer o início dos serviços para mais perto sem eliminar a animação.

**Pontos de revisão:** larguras de 320, 360 e 390 px; menu, quebra dos títulos, botão e altura da cena.

### 7. Acrescentar dados úteis de contato

Se forem confirmados pela empresa, mostrar horário de atendimento, região atendida ou prazo típico de retorno perto da chamada de contato. São informações práticas que ajudam a pessoa a decidir quando escrever.

**Arquivos:** `src/app/components/contact/contact.component.html`, `src/app/data/site-content.ts`.

## Melhorias nas animações

### 1. Dar uma sequência narrativa à entrada

Manter a abertura curta que já foi ajustada. Uma evolução possível é sincronizar o brilho da esfera, a inscrição da marca e o texto: primeiro surgem alguns nós, a logo se revela na superfície curva e, em seguida, entram título e botão. A sequência deve terminar rapidamente e deixar a rotação lenta do globo como movimento contínuo.

**Aplicado nesta revisão:** o globo, a malha de rede, as órbitas e os marcadores são objetos Three.js. A logo original está curvada sobre a superfície externa e gira junto com a esfera. Duas linhas luminosas se movem pela malha, enquanto o texto, a descrição e os botões entram em sequência em aproximadamente 3 s.

**Arquivos:** `src/app/components/hero/hero.component.ts`, `src/app/components/connectivity-scene/connectivity-scene.component.ts`.

### 2. Ajustar a intensidade das rotas de dados

O globo de rede gira em 22 s com a logo aplicada à superfície e duas linhas luminosas que percorrem a esfera em 17 s. Os pontos das duas órbitas externas percorrem os caminhos e variam suavemente de brilho. Uma próxima revisão pode ajustar o contraste desses pontos em telas pequenas.

**Arquivo:** `src/app/components/connectivity-scene/connectivity-scene.component.ts`.

### 3. Fazer o scroll revelar grupos coerentes

Revelar o título e o texto de cada seção como um grupo; nos serviços, manter o atraso curto entre cartões. Evitar que todos os elementos usem a mesma distância e o mesmo movimento. A animação deve acompanhar o scroll na ida e voltar naturalmente ao subir.

**Sugestão de ritmo:** deslocamentos modestos, duração visual de 0,5 a 0,8 s e diferenças pequenas entre cartões. O conteúdo deve continuar legível caso o JavaScript de animação não carregue.

**Arquivo:** `src/app/app.ts`.

### 4. Destacar a navegação conforme a seção visível

Marcar **Soluções** ou **Contato** no menu quando a pessoa estiver naquela parte da página. Uma transição curta de cor ou sublinhado basta; não é necessário adicionar outro efeito de scroll chamativo.

**Arquivos:** `src/app/components/header/header.component.ts`, `src/app/components/header/header.component.html`, `src/styles.css`.

### 5. Refinar as respostas dos botões e cartões

Adicionar movimentos pequenos e consistentes: seta que avança alguns pixels ao passar o mouse, borda que ganha contraste e foco visível ao navegar pelo teclado. Em telas touch, preservar o estado normal, sem depender de hover.

**Arquivo:** `src/styles.css`.

### 6. Reduzir trabalho repetido por quadro

Na cena 3D, a opacidade dos materiais da logo pode deixar de ser recalculada a cada quadro depois que a entrada terminar. Também vale medir a fluidez em celulares e limitar a taxa de renderização ou a resolução do canvas em aparelhos mais lentos, preservando a rotação contínua.

**Arquivo:** `src/app/components/connectivity-scene/connectivity-scene.component.ts`.

### 7. Manter o movimento elegante e confortável

Evitar animações simultâneas de blur, brilho intenso e grande deslocamento. Usar principalmente posição, escala e opacidade; manter os ciclos longos e pausas técnicas quando a cena estiver fora da tela ou a aba estiver oculta, como já ocorre no globo.

## Ordem sugerida

1. Conferir a hero e os dois botões em telas pequenas.
2. Preparar uma seção de projetos com fotos reais autorizadas.
3. Confirmar com a NWL o texto da faixa de atendimento e acrescentar dados úteis que forem confirmados.
4. Refinar o contraste entre seções e a hierarquia dos cartões.
5. Medir a cena 3D em aparelhos modestos e otimizar se houver perda de fluidez.

## Arquivos relacionados

- Estrutura e animações de scroll: `src/app/app.html`, `src/app/app.ts`.
- Texto e cena da hero: `src/app/components/hero/`.
- Globo, marca e órbitas: `src/app/components/connectivity-scene/`.
- Cartões: `src/app/components/services/`.
- Contato e conteúdo: `src/app/components/contact/`, `src/app/data/site-content.ts`.
- Layout, cores e responsividade: `src/styles.css`.
