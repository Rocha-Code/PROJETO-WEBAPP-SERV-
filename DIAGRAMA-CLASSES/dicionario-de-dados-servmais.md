# ServMais – Dicionário de Dados

Descrição das tabelas do banco `servmais` (projeto físico, MySQL).

**Visão geral:** o ServMais é um marketplace de serviços locais. Profissionais publicam serviços e clientes solicitam agendamentos. O banco tem 5 tabelas.

| Tabela | Finalidade |
|---|---|
| `usuario` | Contas de acesso ao sistema (clientes e profissionais) |
| `profissional` | Perfil complementar de usuários do tipo profissional |
| `categoria` | Classificação dos serviços (ex.: eletricista, diarista) |
| `servico` | Serviços publicados por um profissional |
| `agendamento` | Solicitações de horário feitas por clientes |

---

## 1. usuario

Armazena os dados de login e contato de todas as pessoas cadastradas.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | BIGINT | PK, auto incremento | Identificador do usuário |
| nome | VARCHAR(100) | NOT NULL | Nome completo |
| email | VARCHAR(120) | NOT NULL, UNIQUE | E-mail usado no login |
| telefone | VARCHAR(20) | – | Telefone/WhatsApp para contato |
| senha_hash | VARCHAR(255) | NOT NULL | Senha armazenada em hash (nunca em texto puro) |
| tipo | ENUM('cliente','profissional') | NOT NULL | Papel do usuário no sistema |

## 2. profissional

Perfil do prestador de serviço. Relação 1:1 com `usuario`.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | BIGINT | PK, auto incremento | Identificador do perfil profissional |
| usuario_id | BIGINT | FK → usuario(id), NOT NULL, UNIQUE | Usuário dono do perfil |
| bio | TEXT | – | Apresentação do profissional |
| bairro | VARCHAR(80) | – | Bairro/região de atuação |

## 3. categoria

Agrupa os serviços para facilitar a busca.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | BIGINT | PK, auto incremento | Identificador da categoria |
| nome | VARCHAR(60) | NOT NULL, UNIQUE | Nome da categoria |

## 4. servico

Serviço oferecido por um profissional, em uma categoria.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | BIGINT | PK, auto incremento | Identificador do serviço |
| titulo | VARCHAR(100) | NOT NULL | Nome do serviço |
| descricao | TEXT | – | Detalhes do que está incluído |
| duracao_minutos | INT | NOT NULL | Duração estimada, em minutos |
| preco | DECIMAL(10,2) | NOT NULL | Valor do serviço em reais |
| profissional_id | BIGINT | FK → profissional(id), NOT NULL | Profissional que oferece o serviço |
| categoria_id | BIGINT | FK → categoria(id), NOT NULL | Categoria do serviço |

## 5. agendamento

Solicitação de um cliente para um serviço em data e hora específicas.

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id | BIGINT | PK, auto incremento | Identificador do agendamento |
| data | DATE | NOT NULL | Data do atendimento |
| hora_inicio | TIME | NOT NULL | Horário de início |
| status | ENUM('pendente','confirmado','cancelado','concluido') | NOT NULL, padrão 'pendente' | Situação do agendamento |
| observacao | VARCHAR(255) | – | Recado do cliente ao profissional |
| cliente_id | BIGINT | FK → usuario(id), NOT NULL | Cliente que solicitou |
| servico_id | BIGINT | FK → servico(id), NOT NULL | Serviço contratado |
| profissional_id | BIGINT | FK → profissional(id), NOT NULL | Profissional que atenderá |

Restrição única: `UNIQUE (profissional_id, data, hora_inicio)`, que impede dois agendamentos no mesmo horário para o mesmo profissional.

---

## Relacionamentos

| Relacionamento | Cardinalidade | Descrição |
|---|---|---|
| usuario – profissional | 1:0..1 | Um usuário do tipo profissional possui um perfil |
| profissional – servico | 1:N | Um profissional publica vários serviços |
| categoria – servico | 1:N | Uma categoria classifica vários serviços |
| usuario (cliente) – agendamento | 1:N | Um cliente faz vários agendamentos |
| servico – agendamento | 1:N | Um serviço pode ser agendado várias vezes |
| profissional – agendamento | 1:N | Um profissional recebe vários agendamentos |

## Regras de negócio

1. O e-mail do usuário é único no sistema.
2. Somente usuários do tipo `profissional` têm perfil e publicam serviços.
3. Somente usuários do tipo `cliente` solicitam agendamentos.
4. Um profissional não pode ter dois agendamentos com a mesma data e hora de início.
5. Todo agendamento nasce com status `pendente` e o profissional o confirma ou recusa.
6. Senhas são armazenadas apenas como hash.
