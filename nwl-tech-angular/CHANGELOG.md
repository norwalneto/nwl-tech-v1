# Changelog — NWL Soluções Tecnológicas

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

public/assets/nwl-logo.png     # Logo original da NWL
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

### Verificação

`npm run build` concluiu com sucesso em 10/10/2026. O build validou os templates e o TypeScript em modo estrito e gerou os arquivos de produção em `dist/`.

### Referências Angular

- [Estrutura de arquivos do Angular](https://angular.dev/reference/configs/file-structure)
- [bootstrapApplication](https://angular.dev/api/platform-browser/bootstrapApplication)
- [provideBrowserGlobalErrorListeners](https://angular.dev/api/core/provideBrowserGlobalErrorListeners)
