const router = require('express-promise-router')();
const hostController = require('../controllers/host.controller');

router.post('/host', hostController.createHost);

router.get('/hosts', hostController.listAllHosts);

router.get('/host/:id', hostController.findHostById);

router.get('/host/sensores/:id', hostController.sensoresByHostId);

router.put('/host/:id', hostController.updateHostById);

router.delete('/host/:id', hostController.deleteHostById);

module.exports = router;