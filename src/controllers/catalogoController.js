const { Servico, Categoria, Profissional, Usuario } = require('../models');

const ERROS = {
  invalido: 'Informe uma data e um horário válidos.',
  passado: 'Escolha uma data e um horário no futuro.',
  ocupado: 'Esse horário não está disponível para este profissional. Escolha outro.'
};

function moeda(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}

async function montarItens(servicos, categorias) {
  if (servicos.length === 0) return [];

  const nomesCat = {};
  categorias.forEach(c => { nomesCat[c.id] = c.nome; });

  const profIds = [...new Set(servicos.map(s => s.profissionalId))];
  const profs = await Profissional.findAll({ where: { id: profIds } });
  const usuarios = await Usuario.findAll({ where: { id: profs.map(p => p.usuarioId) } });

  const nomesUsuario = {};
  usuarios.forEach(u => { nomesUsuario[u.id] = u; });

  const mapaProf = {};
  profs.forEach(p => {
    const u = nomesUsuario[p.usuarioId] || {};
    mapaProf[p.id] = { nome: u.nome, telefone: u.telefone, bairro: p.bairro, bio: p.bio };
  });

  return servicos.map(s => ({
    id: s.id,
    titulo: s.titulo,
    descricao: s.descricao,
    duracao: s.duracaoMinutos,
    preco: moeda(s.preco),
    categoria: nomesCat[s.categoriaId],
    profissional: mapaProf[s.profissionalId] || {}
  }));
}

exports.listar = async (req, res) => {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  const categoriaId = parseInt(req.query.categoria, 10) || null;
  const where = categoriaId ? { categoriaId } : {};
  const servicos = await Servico.findAll({ where, order: [['titulo', 'ASC']] });
  const itens = await montarItens(servicos, categorias);
  res.render('catalogo/lista', { itens, categorias, categoriaId });
};

exports.detalhe = async (req, res) => {
  const servico = await Servico.findByPk(req.params.id);
  if (!servico) return res.status(404).send('Serviço não encontrado.');

  const categorias = await Categoria.findAll();
  const [item] = await montarItens([servico], categorias);

  const d = new Date();
  const hoje = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  res.render('catalogo/detalhe', { item, hoje, erro: ERROS[req.query.erro] || null });
};