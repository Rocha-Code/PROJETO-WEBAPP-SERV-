const { Servico, Categoria } = require('../models');

const MENSAGENS = {
  criado: 'Serviço cadastrado com sucesso.',
  atualizado: 'Serviço atualizado com sucesso.',
  excluido: 'Serviço excluído com sucesso.',
  emuso: 'Este serviço já tem agendamentos e não pode ser excluído.'
};

function lerDados(body) {
  return {
    titulo: (body.titulo || '').trim(),
    descricao: body.descricao,
    duracaoMinutos: parseInt(body.duracaoMinutos, 10),
    preco: parseFloat(String(body.preco).replace(',', '.')),
    categoriaId: parseInt(body.categoriaId, 10)
  };
}

function validar(d) {
  if (!d.titulo) return 'Informe o título do serviço.';
  if (!Number.isInteger(d.duracaoMinutos) || d.duracaoMinutos <= 0) return 'Informe uma duração válida, em minutos.';
  if (isNaN(d.preco) || d.preco < 0) return 'Informe um preço válido.';
  if (!d.categoriaId) return 'Escolha uma categoria.';
  return null;
}

exports.listar = async (req, res) => {
  const profissionalId = req.session.usuario.profissionalId;
  const servicos = await Servico.findAll({ where: { profissionalId }, order: [['id', 'DESC']] });
  const categorias = await Categoria.findAll();
  const nomes = {};
  categorias.forEach(c => { nomes[c.id] = c.nome; });

  const msg = MENSAGENS[req.query.msg] || null;
  const erro = req.query.msg === 'emuso' ? msg : null;
  const ok = erro ? null : msg;
  res.render('servicos/lista', { servicos, nomes, ok, erro });
};

exports.formNovo = async (req, res) => {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('servicos/form', {
    servico: {}, categorias, erro: null,
    acao: '/profissional/servicos', tituloPagina: 'Novo serviço'
  });
};

exports.criar = async (req, res) => {
  const dados = lerDados(req.body);
  const erro = validar(dados);
  if (erro) {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    return res.render('servicos/form', {
      servico: dados, categorias, erro,
      acao: '/profissional/servicos', tituloPagina: 'Novo serviço'
    });
  }
  await Servico.create({ ...dados, profissionalId: req.session.usuario.profissionalId });
  res.redirect('/profissional/servicos?msg=criado');
};

exports.formEditar = async (req, res) => {
  const servico = await Servico.findOne({
    where: { id: req.params.id, profissionalId: req.session.usuario.profissionalId }
  });
  if (!servico) return res.status(404).send('Serviço não encontrado.');
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.render('servicos/form', {
    servico, categorias, erro: null,
    acao: `/profissional/servicos/${servico.id}`, tituloPagina: 'Editar serviço'
  });
};

exports.atualizar = async (req, res) => {
  const servico = await Servico.findOne({
    where: { id: req.params.id, profissionalId: req.session.usuario.profissionalId }
  });
  if (!servico) return res.status(404).send('Serviço não encontrado.');

  const dados = lerDados(req.body);
  const erro = validar(dados);
  if (erro) {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    return res.render('servicos/form', {
      servico: { ...dados, id: servico.id }, categorias, erro,
      acao: `/profissional/servicos/${servico.id}`, tituloPagina: 'Editar serviço'
    });
  }
  await servico.update(dados);
  res.redirect('/profissional/servicos?msg=atualizado');
};

exports.excluir = async (req, res) => {
  const servico = await Servico.findOne({
    where: { id: req.params.id, profissionalId: req.session.usuario.profissionalId }
  });
  if (!servico) return res.status(404).send('Serviço não encontrado.');

  try {
    await servico.destroy();
    res.redirect('/profissional/servicos?msg=excluido');
  } catch (err) {
    // chave estrangeira: já existem agendamentos para esse serviço
    res.redirect('/profissional/servicos?msg=emuso');
  }
};