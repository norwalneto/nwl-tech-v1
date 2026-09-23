# NWL — site institucional em Angular

Projeto Angular 21 com componentes standalone, TypeScript e CSS. Inclui a logo original da NWL, as cinco áreas de serviço e contatos por WhatsApp, Instagram e e-mail.

A logo ao lado de **Conecte. Proteja. Fortaleça.** aparece sem cartão ou borda, com um movimento suave. O movimento é desativado quando o visitante solicita animações reduzidas no sistema. O fundo do site usa os tons azul-marinho da imagem original (#0d0e20, #181d3b e #23284e), com um degradê suave. Os cartões seguem a mesma paleta. O arquivo original da logo foi preservado; uma máscara CSS suaviza as bordas para integrá-la ao fundo.

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

O resultado fica em `dist/`. Publique o conteúdo dessa pasta em uma hospedagem para sites estáticos. O projeto não precisa de um servidor Java ou de banco de dados.

Para hospedar em uma subpasta, por exemplo `/nwl/`:

```bash
npm run build -- --base-href /nwl/
```

## Onde editar

| O que você quer alterar | Arquivo |
| --- | --- |
| WhatsApp, e-mail e Instagram | `src/app/data/site-content.ts` |
| Menu e marca no cabeçalho | `src/app/components/header/header.component.html` |
| Título inicial e logo flutuante | `src/app/components/hero/hero.component.html` |
| Descrições dos serviços | `src/app/components/services/services.component.html` |
| Área de contato | `src/app/components/contact/contact.component.html` |
| Rodapé | `src/app/components/footer/footer.component.html` |
| Cores, layout, responsividade e animação da logo | `src/styles.css` |
| Imagem original da logo | `public/assets/nwl-logo.png` |
| Título da aba, descrição e ícone | `src/index.html` |

Os links do WhatsApp são calculados por `whatsappUrl()` e codificam as mensagens automaticamente. Eles abrem o WhatsApp; nenhuma mensagem é enviada automaticamente. Não há formulário, coleta de dados, rastreamento ou backend neste projeto.

## Dependências e validação

- Angular 21.2, TypeScript 5.9 e RxJS 7.8.
- `package-lock.json` incluído para instalação reproduzível com `npm ci`.
- Compilação de produção valida TypeScript e os templates com modo estrito.
- A fonte Manrope é carregada do Google Fonts; se não estiver disponível, o site utiliza Arial.
- Compatibilidade oficial de versões: https://angular.dev/reference/versions

O ZIP contém o código-fonte e os recursos necessários. `node_modules`, caches, credenciais e configurações da hospedagem privada não são incluídos.
