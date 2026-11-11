const express = require('express');
const ag = require('../controllers/agendamentoController');
const { exigirTipo } = require('../middlewares/auth');

const router = express.Router();

// Cliente
router.post('/agendamentos', exigirTipo('cliente'), ag.criar);
router.get('/meus-agendamentos', exigirTipo('cliente'), ag.meus);
router.post('/agendamentos/:id/cancelar', exigirTipo('cliente'), ag.cancelar);

// Profissional
router.get('/profissional/agendamentos', exigirTipo('profissional'), ag.painel);
router.post('/profissional/agendamentos/:id/:acao', exigirTipo('profissional'), ag.alterarStatus);

module.exports = router;