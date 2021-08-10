const router = require('express-promise-router')();
const emailController = require('../controllers/email.controller');

// ==> Definindo as rotas do CRUD - 'Email':

// ==> Rota responsável por selecionar email -> terá apenas um email na base
router.get('/email', emailController.findEmail);

// ==> Rota responsável por atualizar email
router.put('/email', emailController.updateEmail);

module.exports = router;