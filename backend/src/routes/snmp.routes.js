const router = require('express-promise-router')();
const snmpController = require('../controllers/snmp.controller');

router.post('/testeSnmp', snmpController.testSnmpOid);

module.exports = router;