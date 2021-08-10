const router = require('express-promise-router')();
const severidadeController = require('../controllers/severidade.controller');

// ==> Rota responsável por listar todos as 'Severidades'
router.get('/severidades', severidadeController.listAllSeveridades);


module.exports = router;