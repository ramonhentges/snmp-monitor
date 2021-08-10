const router = require('express-promise-router')();
const informationController = require('../controllers/information.controller');

router.get('/dashboard', informationController.dashboardInfo);

router.get('/dashboard/:idGrupo', informationController.dashboardGroup);

router.get('/problemas/:dataInicial/:dataFinal', informationController.problemas);

router.get('/problemasgrupo/:dataInicial/:dataFinal/:idGrupo', informationController.problemasGrupo);

router.get('/problemashost/:dataInicial/:dataFinal/:idHost', informationController.problemasHost);

router.get('/historico/:idHost/:idSensor/:periodo', informationController.historico);

router.get('/historicodata/:idHost/:idSensor/:dataInicial/:dataFinal', informationController.historicoData);

module.exports = router