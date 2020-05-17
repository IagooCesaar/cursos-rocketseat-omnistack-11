# 11ª Semana OmniStack da Rocketseat – BeTheHero

## Sobre o projeto

Durante os dias 23 a27 de março deste ano participei da **11ª Semana OmniStack** da **[Rocketseat](https://rocketseat.com.br/)**, evento totalmente gratuito com inuito de possibilitar a desenvolvedores (iniciantes ou mais avançados) dar os primeiros passos com a stack _Node.js, React.Js e React Native_, e nesta vez a aplicação desenvolvida foi fora de série 😉.

A inspiração, segundo [Diego Fernandes](https://www.linkedin.com/in/diego-schell-fernandes/), CEO da Rocketseat e responsável por ministrar as aulas, foi a [Associação Protetora dos Animais Desamparados – APAD](https://www.facebook.com/apadrsl/), uma ONG especializada em cuidar dos animais mais necessitados.

Com uma inspiração tão nobre, a aplicação a ser desenvolvida não poderia ser uma "simples" aplicação. E com isso, tivemos uma Semana OmniStack sem precedentes. Como destaque, o diferencial das Semanas OmniStacks anteriores: introdução a **#TDD**, banco de dados relacional com **#Knex** e introdução a **autenticação e autorização** de usuários conectados (de forma simples, obtendo um código único identificador da ONG contido no cabeçalho de uma requisição enviada pelas aplicações frontend)

Eu havia feito uma maratona de Semanas OmniStacks, da 7ª até a 10ª edição. TOdas elas apresentaram características muito semelhantes: **#backend** em **#Node.js**, **#frontend** com **#React.JS**, **#mobile** com **#ReacNative** e depois **#WebSockets** (para notificações ou atualizações em tempo "real"). No entanto, a 11ª edulçaim trazendo esse leque de conteúdos novos, eu não poderia simplesmente fazer "mais do mesmo", que seria apenas recriar a aplicação durante os 5 dias, conforme proposta da Rocketseat.

Eu resolvi ir além desta vez 😎.

## 👌 Projeto original

Originalmente (aqui tem um link do último [commit](https://github.com/IagooCesaar/cursos-rocketseat-omnistack-11/tree/2d32f5437f9d2de5bd13c2f1b5f14e1b482ad419) referente ao conteúdo das aulas), o sistema **#BeTheHero** foi desenvolvido da seguinte forma:

- Backend (API) em node, responsável por prover todos os dados necessários para as interfaces, com:
  - **#Express**
  - Banco de dados relacional **#SQLite3**, com **#Knex**
  - **#Jest** e **#Supertest** para testes
- Frontend web em **#ReactJs**, responsável por permitir o cadastro de ONGS e a manutenção de casos (incidentes)
- Fronent mobile em **#ReactNative**, responsável por permitir a pessoas comuns a ajudarem as ONGs em casos selecionados, permitindo o contato através de envio de e-mail ou por WhatsApp

> Em resumo, o frontend web era destinado para as ONGs e o frontend mobile era destinado as pessoas que desejam ajudar essas ONGs

## 💼 Minhas alterações

Resolvi reconstruir o backend misturando bibliotecas que vi em outros cursos e as bibliotecas propostas originalmente para esta Semana OmniStack. Então a API foi construída da seguinte forma:

- troquei o Express pelo **#HapiJs** e com ele eu adicionei:
  - **#HapiSwagger** para gerar um espécie de documentação automática da API
- Mantive o **#Knex** mas alterei o banco de dados para **#Postgres** e para isso eu utilizei **#Docker**
- Para testes eu utilizei o **#Mocha**
- Adicionei controle de autorização com

Além de ter alterado as bibliotecas e frameworks utilizados originalmente pelo projeto, implementei tambem novas rotas para possibilitar novas implementações nas aplicações frontend. Confira aqui 👇 uma pequena demonstração das rotas disponíveis e o Swagger em execução

![11-backend-swagger](https://user-images.githubusercontent.com/12894025/82146988-0eee5880-9823-11ea-8abc-e9dab21b48a9.gif)

O frontend web continua com foco nas ONGs, mas eu implementei novas features, como:

- Login com usuário e senha
- Possibilidade de a ONG alterar seus dados cadastrais
- Possibilidade de a ONG alterar os dados de caso (incidente)
- **#Hook** de autorização para disponibilizar apenas as páginas que o usuário tiver permissão para acessar

![11-frontend-simple-usage](https://user-images.githubusercontent.com/12894025/82147379-c97f5a80-9825-11ea-88f9-d0405551cca3.gif)

O frontend mobile passa a permitir que a ONG também realize manutenção dos casos, além de implementar a visualização para usuários não autenticados (para pessoas comuns). Ou seja, possuí dois métodos de controle de acesso: acesso com usuáro e senha e acesso anônimo.

As ONGs que ainda não possuem cadastro poderão fazê-lo também no mobile, mas ainda não implementei a manutenção de seus dados cadastrais.

![11-mobile-simple-usage_1](https://user-images.githubusercontent.com/12894025/82148520-e9654d00-982a-11ea-920b-cfb60c5fad8c.gif)

## 💻 Como executar o projeto

...

## 📹 Vídeos demonstrativos

Preparei 3 vídeos demonstrando a execução dos projetos:

- banckend: link
- frontend web: link
- frontend mobile: link
