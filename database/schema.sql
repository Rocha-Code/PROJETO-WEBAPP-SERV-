CREATE DATABASE servmais CHARACTER SET utf8mb4;
USE servmais;

CREATE TABLE usuario (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('cliente','profissional') NOT NULL
);

CREATE TABLE profissional (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL UNIQUE,
  bio TEXT,
  bairro VARCHAR(80),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE categoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE servico (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracao_minutos INT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  profissional_id BIGINT NOT NULL,
  categoria_id BIGINT NOT NULL,
  FOREIGN KEY (profissional_id) REFERENCES profissional(id),
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE agendamento (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  status ENUM('pendente','confirmado','cancelado','concluido') NOT NULL DEFAULT 'pendente',
  observacao VARCHAR(255),
  cliente_id BIGINT NOT NULL,
  servico_id BIGINT NOT NULL,
  profissional_id BIGINT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES usuario(id),
  FOREIGN KEY (servico_id) REFERENCES servico(id),
  FOREIGN KEY (profissional_id) REFERENCES profissional(id),
  UNIQUE (profissional_id, data, hora_inicio)
);

INSERT INTO categoria (nome) VALUES
('Eletricista'), ('Diarista'), ('Manicure'), ('Aulas particulares');