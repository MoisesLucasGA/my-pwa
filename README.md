# About

This is a fully offline app for managing and controlling clothing repairs.

# Stack

- React
- Vite
- TypeScript
- Tailwind
- ShadcnUI
- IndexDB

# Install

To use on your browser, simply:

- Clone the repository `git clone https://github.com/MoisesLucasGA/my-pwa.git`
- Install the dependencies `pnpm install`
- Run the project `pnpm dev`

To use the installable version, a few extra steps are required, as the option to install a PWA only appears if you are accessing via a secure connection (HTTPS).

1. Generate a certificate for your IP using [MKCERT](https://github.com/FiloSottile/mkcert).
2. Add the certificate to the project's ROOT and modify the path in `vite.config.ts` if necessary.
3. The same certificate must be accepted on the mobile phone where you want to install it. It is usually located in the Security and Privacy section.
4. You need to restart your mobile phone's browser for the certificate to take effect.
5. Run the project with the URL for your exposed network `pnpm dev --host`.
6. Access the URL while connected to the same network as your PC, and the option to install should appear on the initial screen.

# PT-BR

## Sobre

Esse é um app totalmente offline para a gestão e controle de consertos de roupas.

## Instalação

Para usar no navegador basta:

- Clonar o repositório `git clone https://github.com/MoisesLucasGA/my-pwa.git`
- Instalar as dependências `pnpm install`
- Executar o projeto `pnpm dev`

Para usar a versão instalável é necessário alguns passos extras, já que a opção para instalar um PWA só aparece caso você esteja acessando via uma conexão segura (HTTPS).

1. Gere um certificado para seu IP usando o [MKCERT](https://github.com/FiloSottile/mkcert).
2. Adicione o certificado no ROOT do projeto e modifique o caminho no `vite.config.ts` caso necessário.
3. O mesmo certificado deve ser aceito no celular que deseja instalar. Normalmente fica na seção de Segurança e Privacidade.
4. É necessário reinicializar o navegador do celular, para que o certificado entre em ação.
5. Execute o projeto com a URL para sua rede exposta `pnpm dev --host`.
6. Acesse a URL estando conectado a mesma rede que seu PC e a opção para instalar deve aparecer na tela inicial.
