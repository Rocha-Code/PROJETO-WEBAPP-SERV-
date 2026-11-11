const bcrypt = require('bcryptjs');
const { Usuario, Profissional } = require('../models');

exports.formCadastro = (req, res) => {
  res.render('cadastro', { erro: null, dados: {} });
};

exports.cadastrar = async (req, res) => {
  const { nome, email, telefone, senha, tipo, bairro } = req.body;
  const dados = { nome, email, telefone, tipo, bairro };

  if (!nome || !email || !senha || !['cliente', 'profissional'].includes(tipo)) {
    return res.render('cadastro', { erro: 'Preencha todos os campos obrigatórios.', dados });
  }
  if (senha.length < 6) {
    return res.render('cadastro', { erro: 'A senha deve ter pelo menos 6 caracteres.', dados });
  }

  const existente = await Usuario.findOne({ where: { email } });
  if (existente) {
    return res.render('cadastro', { erro: 'Este e-mail já está cadastrado.', dados });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await Usuario.create({ nome, email, telefone, senhaHash, tipo });

  if (tipo === 'profissional') {
    await Profissional.create({ usuarioId: usuario.id, bairro });
  }

  res.redirect('/login?cadastro=ok');
};

exports.formLogin = (req, res) => {
  const ok = req.query.cadastro === 'ok' ? 'Cadastro realizado! Faça login.' : null;
  res.render('login', { erro: null, ok });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  const senhaOk = usuario && await bcrypt.compare(senha || '', usuario.senhaHash);
  if (!senhaOk) {
    return res.render('login', { erro: 'E-mail ou senha incorretos.', ok: null });
  }

  const sessao = { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo };
  if (usuario.tipo === 'profissional') {
    const perfil = await Profissional.findOne({ where: { usuarioId: usuario.id } });
    sessao.profissionalId = perfil ? perfil.id : null;
  }

  req.session.usuario = sessao;
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};