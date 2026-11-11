const express = require('express');
const catalogo = require('../controllers/catalogoController');

const router = express.Router();

router.get('/', catalogo.listar);
router.get('/:id', catalogo.detalhe);

module.exports = router;