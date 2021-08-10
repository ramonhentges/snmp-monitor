const router = require('express-promise-router')();
const groupController = require('../controllers/group.controller');

// ==> Definindo as rotas do CRUD - 'HostGroup':

// ==> Rota responsável por criar um novo
router.post('/group', groupController.createGroup);

// ==> Rota responsável por listar todos
router.get('/groups', groupController.listAllGroups);

// ==> Rota responsável por selecionar pelo id
router.get('/group/:id', groupController.findGroupById);

// ==> Rota responsável por atualizar
router.put('/group/:id', groupController.updateGroupById);

// ==> Rota responsável por excluir
router.delete('/group/:id', groupController.deleteGroupById);

module.exports = router;