const router = require('express-promise-router')();
const templateController = require('../controllers/template.controller');

// ==> Definindo as rotas do CRUD - 'Template':

// ==> Rota responsável por criar um novo
router.post('/template', templateController.createTemplate);

// ==> Rota responsável por listar todos
router.get('/templates', templateController.listAllTemplates);

// ==> Rota responsável por selecionar pelo id
router.get('/template/:id', templateController.findTemplateById);

// ==> Rota responsável por atualizar
router.put('/template/:id', templateController.updateTemplateById);

// ==> Rota responsável por excluir
router.delete('/template/:id', templateController.deleteTemplateById);

module.exports = router;