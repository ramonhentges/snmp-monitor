const router = require('express-promise-router')();
const graficoController = require('../controllers/grafico.controller');

// ==> Rota responsável por listar todos os 'Grafico': (GET): localhost:3000/api/products
router.get('/grafico', graficoController.listAllGrafico);

module.exports = router;