const express = require('express');
const servico = require('../controllers/servicoController');
const { exigirTipo } = require('../middlewares/auth');

const router = express.Router();

router.use(exigirTipo('profissional')); // protege todas as rotas abaixo

router.get('/', servico.listar);
router.get('/novo', servico.formNovo);
router.post('/', servico.criar);
router.get('/:id/editar', servico.formEditar);
router.post('/:id', servico.atualizar);
router.post('/:id/excluir', servico.excluir);

module.exports = router;