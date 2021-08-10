const router = require('express-promise-router')();
const hostGroupController = require('../controllers/host.group.controller');

router.post('/hostgroup', hostGroupController.createHostGroup);

router.get('/hostgroup/group/:id', hostGroupController.findGroupHostById);

router.get('/hostgroup/host/:id', hostGroupController.findHostGroupById);

router.delete('/hostgroup/:idHost/:idGrupo', hostGroupController.deleteHostGroup);

router.delete('/grouphost/:idGrupo/:idHost', hostGroupController.deleteGroupHost);

module.exports = router;