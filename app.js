require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const catalogoRoutes = require('./src/routes/catalogoRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');

const app = express();

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Arquivos estáticos e leitura de formulários
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.urlencoded({ extended: true }));

// Sessão (guarda quem está logado)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Deixa o usuário logado disponível em todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rotas
app.get('/', (req, res) => res.render('index'));
app.use('/', authRoutes);
app.use('/profissional/servicos', servicoRoutes);
app.use('/servicos', catalogoRoutes);
app.use('/', agendamentoRoutes);

// Conexão com o banco
sequelize.authenticate()
  .then(() => console.log('Banco conectado'))
  .catch(err => console.error('Erro no banco:', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});