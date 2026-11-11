const { Op } = require('sequelize');
const { Agendamento, Servico, Usuario, Profissional } = require('../models');

const ROTULOS = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído'
};

const MENSAGENS = {
  criado: 'Agendamento solicitado! Aguarde a confirmação do profissional.',
  cancelado: 'Agendamento cancelado.',
  atualizado: 'Agendamento atualizado.'
};

const dataBR = d => String(d).split('-').reverse().join('/');
const hora = h => String(h).slice(0, 5);
const toMin = h => {
  const [hh, mm] = String(h).split(':');
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
};

// ---------- CLIENTE ----------

exports.criar = async (req, res) => {
  const { servicoId, data, horaInicio, observacao } = req.body;

  const servico = await Servico.findByPk(servicoId);
  if (!servico) return res.status(404).send('Serviço não encontrado.');

  const voltar = codigo => res.redirect(`/servicos/${servico.id}?erro=${codigo}`);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '') || !/^\d{2}:\d{2}$/.test(horaInicio || '')) {
    return voltar('invalido');
  }
  const quando = new Date(`${data}T${horaInicio}:00`);
  if (isNaN(quando.getTime()) || quando <= new Date()) return voltar('passado');

  // Regra de negócio: não permitir sobreposição de horários do mesmo profissional
  const ativos = await Agendamento.findAll({
    where: {
      profissionalId: servico.profissionalId,
      data,
      status: { [Op.in]: ['pendente', 'confirmado'] }
    }
  });
  const idsServicos = [...new Set(ativos.map(a => a.servicoId))];
  const servicosAtivos = idsServicos.length ? await Servico.findAll({ where: { id: idsServicos } }) : [];
  const duracoes = {};
  servicosAtivos.forEach(s => { duracoes[s.id] = s.duracaoMinutos; });

  const inicio = toMin(horaInicio);
  const fim = inicio + servico.duracaoMinutos;
  const conflito = ativos.some(a => {
    const i = toMin(a.horaInicio);
    const f = i + (duracoes[a.servicoId] || 0);
    return inicio < f && i < fim;
  });
  if (conflito) return voltar('ocupado');

  try {
    // Se já existe um registro cancelado exatamente nesse horário, reaproveita
    const existente = await Agendamento.findOne({
      where: { profissionalId: servico.profissionalId, data, horaInicio }
    });
    if (existente) {
      await existente.update({
        clienteId: req.session.usuario.id,
        servicoId: servico.id,
        status: 'pendente',
        observacao
      });
    } else {
      await Agendamento.create({
        data,
        horaInicio,
        observacao,
        clienteId: req.session.usuario.id,
        servicoId: servico.id,
        profissionalId: servico.profissionalId
      });
    }
  } catch (err) {
    return voltar('ocupado');
  }

  res.redirect('/meus-agendamentos?msg=criado');
};

exports.meus = async (req, res) => {
  const agendamentos = await Agendamento.findAll({
    where: { clienteId: req.session.usuario.id },
    order: [['data', 'DESC'], ['horaInicio', 'DESC']]
  });

  const servicos = agendamentos.length
    ? await Servico.findAll({ where: { id: [...new Set(agendamentos.map(a => a.servicoId))] } })
    : [];
  const profs = agendamentos.length
    ? await Profissional.findAll({ where: { id: [...new Set(agendamentos.map(a => a.profissionalId))] } })
    : [];
  const usuarios = profs.length
    ? await Usuario.findAll({ where: { id: profs.map(p => p.usuarioId) } })
    : [];

  const nomeServico = {};
  servicos.forEach(s => { nomeServico[s.id] = s.titulo; });
  const nomeUsuario = {};
  usuarios.forEach(u => { nomeUsuario[u.id] = u.nome; });
  const nomeProf = {};
  profs.forEach(p => { nomeProf[p.id] = nomeUsuario[p.usuarioId]; });

  const itens = agendamentos.map(a => ({
    id: a.id,
    data: dataBR(a.data),
    hora: hora(a.horaInicio),
    servico: nomeServico[a.servicoId],
    profissional: nomeProf[a.profissionalId],
    status: a.status,
    rotulo: ROTULOS[a.status],
    podeCancelar: ['pendente', 'confirmado'].includes(a.status)
  }));

  res.render('agendamentos/meus', { itens, ok: MENSAGENS[req.query.msg] || null });
};

exports.cancelar = async (req, res) => {
  const ag = await Agendamento.findOne({
    where: {
      id: req.params.id,
      clienteId: req.session.usuario.id,
      status: { [Op.in]: ['pendente', 'confirmado'] }
    }
  });
  if (!ag) return res.status(404).send('Agendamento não encontrado.');
  await ag.update({ status: 'cancelado' });
  res.redirect('/meus-agendamentos?msg=cancelado');
};

// ---------- PROFISSIONAL ----------

const TRANSICOES = {
  confirmar: { de: 'pendente', para: 'confirmado' },
  recusar: { de: 'pendente', para: 'cancelado' },
  concluir: { de: 'confirmado', para: 'concluido' }
};

exports.painel = async (req, res) => {
  const agendamentos = await Agendamento.findAll({
    where: { profissionalId: req.session.usuario.profissionalId },
    order: [['data', 'ASC'], ['horaInicio', 'ASC']]
  });

  const servicos = agendamentos.length
    ? await Servico.findAll({ where: { id: [...new Set(agendamentos.map(a => a.servicoId))] } })
    : [];
  const clientes = agendamentos.length
    ? await Usuario.findAll({ where: { id: [...new Set(agendamentos.map(a => a.clienteId))] } })
    : [];

  const nomeServico = {};
  servicos.forEach(s => { nomeServico[s.id] = s.titulo; });
  const mapaCliente = {};
  clientes.forEach(c => { mapaCliente[c.id] = c; });

  const itens = agendamentos.map(a => {
    const c = mapaCliente[a.clienteId] || {};
    return {
      id: a.id,
      data: dataBR(a.data),
      hora: hora(a.horaInicio),
      servico: nomeServico[a.servicoId],
      cliente: c.nome,
      telefone: c.telefone,
      observacao: a.observacao,
      status: a.status,
      rotulo: ROTULOS[a.status]
    };
  });

  res.render('agendamentos/painel', { itens, ok: MENSAGENS[req.query.msg] || null });
};

exports.alterarStatus = async (req, res) => {
  const regra = TRANSICOES[req.params.acao];
  if (!regra) return res.status(400).send('Ação inválida.');

  const ag = await Agendamento.findOne({
    where: {
      id: req.params.id,
      profissionalId: req.session.usuario.profissionalId,
      status: regra.de
    }
  });
  if (!ag) return res.status(404).send('Agendamento não encontrado ou ação não permitida.');

  await ag.update({ status: regra.para });
  res.redirect('/profissional/agendamentos?msg=atualizado');
};