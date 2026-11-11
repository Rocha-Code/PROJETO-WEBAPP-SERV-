# ServMais

Marketplace de serviços locais com agendamento de horários. Conecta profissionais
(eletricista, diarista, manicure, aulas particulares etc.) a clientes da cidade.

**Sistema online:** https://servmais.onrender.com
(o primeiro acesso pode levar cerca de 1 minuto para carregar)

## Funcionalidades
- Cadastro e login de clientes e profissionais
- Profissional: cadastra, edita e exclui seus serviços
- Cliente: busca serviços por categoria e solicita agendamentos
- Bloqueio de horários conflitantes
- Profissional confirma, recusa ou conclui atendimentos

## Tecnologias
Node.js, Express, EJS, Sequelize, MySQL (TiDB Cloud), padrão MVC.
Hospedagem: Render. Código: GitHub.

## Como rodar localmente
1. `git clone` este repositório e `npm install`
2. Crie o banco executando `database/schema.sql` no MySQL
3. Crie um arquivo `.env` com: PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, SESSION_SECRET
4. `npm run dev` e acesse http://localhost:3000

## Estrutura
- `src/models`: tabelas (Sequelize)
- `src/views`: telas (EJS)
- `src/controllers`: regras de negócio
- `src/routes`: rotas
- `database/schema.sql`: projeto físico do banco

## Documentação
Diagrama de classes (`PROJETO-WEBAPP-SERVMAIS.drawio`), dicionário de dados e documentação do projeto.

Autor: Guilherme Rodrigues França da Rocha
