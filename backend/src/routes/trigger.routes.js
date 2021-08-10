const router = require('express-promise-router')();
const triggerController = require('../controllers/trigger.controller');

// ==> Definindo as rotas do CRUD - 'Trigger':

// ==> Rota responsável por criar um novo 'Trigger'
router.post('/trigger', triggerController.createTrigger);

// ==> Rota responsável por listar todos os 'Triggers' de um Template
router.get('/triggers/:idTemplate', triggerController.listAllTriggers);

// ==> Rota responsável por selecionar 'Trigger' pelo 'Id'
router.get('/trigger/:id', triggerController.findTriggerById);

// ==> Rota responsável por atualizar 'Trigger' pelo 'Id'
router.put('/trigger/:id', triggerController.updateTriggerById);

// ==> Rota responsável por excluir 'Trigger' pelo 'Id'
router.delete('/trigger/:id', triggerController.deleteTriggerById);

module.exports = router;