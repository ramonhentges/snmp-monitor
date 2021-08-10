const router = require('express-promise-router')();
const hostTemplateController = require('../controllers/host.template.controller');

// ==> Definindo as rotas do CRUD - 'HostTemplate':

// ==> Rota responsável por criar um novo
router.post('/hosttemplate', hostTemplateController.createHostTemplate);

// ==> Rota responsável por pegar todos os hosts da template pelo Id
router.get('/hosttemplate/template/:id', hostTemplateController.findTemplateHostById);

// ==> Rota responsável por pegar todos os templates do host pelo Id
router.get('/hosttemplate/host/:id', hostTemplateController.findHostTemplateById);

// ==> Rota responsável por excluir pelo id
router.delete('/hosttemplate/:idHost/:idTemplate', hostTemplateController.deleteHostTemplate);

router.delete('/templatehost/:idTemplate/:idHost', hostTemplateController.deleteTemplateHost);

module.exports = router;