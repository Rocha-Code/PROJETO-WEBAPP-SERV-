# ServMais – Documentação do Projeto

## 1. Visão geral

O ServMais é uma aplicação web que funciona como marketplace de serviços locais, conectando quem presta um serviço (profissional) a quem precisa dele (cliente) e permitindo o agendamento de horários direto na plataforma.

> Nota: o projeto foi elaborado do zero nesta etapa, pois o PIT-I não foi cursado pelo estudante.

## 2. Problema

Em cidades menores, a contratação de serviços (eletricista, diarista, manicure, aulas particulares, etc.) costuma depender de indicação informal e conversas por aplicativo de mensagens. Isso gera problemas para os dois lados:

- **Clientes:** não sabem a quem recorrer, não conseguem comparar profissionais, preços e disponibilidade, e perdem tempo negociando horários.
- **Profissionais:** têm pouca visibilidade fora do círculo de conhecidos e controlam a agenda de forma manual, sujeita a conflitos de horário.

## 3. Objetivos

**Objetivo geral:** desenvolver uma aplicação web que centralize a oferta de serviços locais e o agendamento de horários entre profissionais e clientes.

**Objetivos específicos:**
- Permitir que profissionais divulguem seus serviços com descrição, duração e preço.
- Permitir que clientes encontrem serviços por categoria e solicitem um horário.
- Dar ao profissional o controle de confirmar ou recusar solicitações.
- Evitar conflitos de horário na agenda do profissional.

## 4. Público-alvo

- **Clientes:** moradores da cidade que procuram serviços.
- **Profissionais:** autônomos e pequenos prestadores de serviço locais.

## 5. Requisitos funcionais

| Código | Requisito |
|---|---|
| RF01 | O sistema deve permitir o cadastro de usuários como cliente ou profissional. |
| RF02 | O sistema deve permitir login e logout com e-mail e senha. |
| RF03 | O profissional deve poder completar seu perfil (bio e bairro). |
| RF04 | O profissional deve poder cadastrar, editar e excluir seus serviços (título, descrição, duração, preço e categoria). |
| RF05 | O cliente deve poder listar serviços e filtrar por categoria. |
| RF06 | O cliente deve poder visualizar os detalhes de um serviço e o profissional responsável. |
| RF07 | O cliente deve poder solicitar um agendamento informando data, horário e observação. |
| RF08 | O sistema deve impedir dois agendamentos no mesmo horário para o mesmo profissional. |
| RF09 | O profissional deve poder confirmar ou recusar solicitações recebidas. |
| RF10 | O cliente deve poder cancelar um agendamento e acompanhar seu status. |
| RF11 | O profissional deve poder marcar um atendimento como concluído. |

## 6. Requisitos não funcionais

| Código | Requisito |
|---|---|
| RNF01 | A interface deve ser responsiva e funcionar em celular e computador. |
| RNF02 | As senhas devem ser armazenadas apenas em formato de hash. |
| RNF03 | A aplicação deve seguir o padrão arquitetural MVC. |
| RNF04 | A interface deve ser clara, consistente e simples, com mensagens de retorno (feedback) para as ações do usuário. |
| RNF05 | Rotas restritas devem exigir usuário autenticado e verificar o tipo de perfil. |
| RNF06 | O sistema deve estar disponível online por meio de hospedagem gratuita. |

## 7. Regras de negócio

1. O e-mail do usuário é único no sistema.
2. Somente profissionais publicam serviços; somente clientes solicitam agendamentos.
3. Um profissional não pode ter dois agendamentos com a mesma data e hora de início.
4. Todo agendamento é criado com status "pendente" e passa a "confirmado" ou "cancelado" por decisão do profissional ou do cliente; após o atendimento, passa a "concluído".
5. O horário solicitado deve ser futuro.

## 8. Atores e fluxo principal

**Atores:** Cliente e Profissional.

**Fluxo principal:**
1. O profissional se cadastra e publica seus serviços.
2. O cliente se cadastra e navega pelos serviços por categoria.
3. O cliente escolhe um serviço e solicita data e horário.
4. O sistema valida a disponibilidade e registra o agendamento como pendente.
5. O profissional confirma ou recusa.
6. O cliente acompanha o status; após o atendimento, o profissional marca como concluído.

## 9. Telas previstas (wireframes)

1. Página inicial (lista de categorias e serviços em destaque)
2. Cadastro e login
3. Lista de serviços com filtro por categoria
4. Detalhe do serviço e formulário de agendamento
5. Meus agendamentos (cliente)
6. Painel do profissional: meus serviços (cadastro e edição)
7. Painel do profissional: solicitações recebidas (confirmar ou recusar)

## 10. Arquitetura e tecnologias

- **Padrão:** MVC (Model, View, Controller).
- **Back-end:** Node.js com Express *(a confirmar)*
- **Front-end:** HTML, CSS e JavaScript, com templates EJS *(a confirmar)*
- **Banco de dados:** MySQL, com ORM Sequelize *(a confirmar)*
- **Modo de codificação:** tradicional
- **Controle de versão:** Git e GitHub

## 11. Modelagem

O diagrama de classes, o modelo ER, o projeto físico e o dicionário de dados estão nos arquivos `PROJETO-WEBAPP-SERVMAIS.drawio`, `dicionario-de-dados-servmais.md` e no script SQL do banco `servmais`.

## 12. Fora do escopo (trabalhos futuros)

- Avaliações e notas dos profissionais
- Pagamento online
- Chat entre cliente e profissional
- Disponibilidade semanal configurável pelo profissional
- Mapa e busca por proximidade
- Notificações por e-mail ou mensagem
