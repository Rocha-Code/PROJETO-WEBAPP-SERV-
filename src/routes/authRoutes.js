const express = require('express');
const auth = require('../controllers/authController');

const router = express.Router();

router.get('/cadastro', auth.formCadastro);
router.post('/cadastro', auth.cadastrar);
router.get('/login', auth.formLogin);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

module.exports = router;