const router = require('express-promise-router')();
const sensorController = require('../controllers/sensor.controller');

// ==> Definindo as rotas do CRUD - 'Sensor':

// ==> Rota responsável por criar um novo 'Sensor'
router.post('/sensor', sensorController.createSensor);

// ==> Rota responsável por listar todos os 'Sensores' de um Template
router.get('/sensores/:idTemplate', sensorController.listAllSensores);

// ==> Rota responsável por selecionar 'Sensor' pelo 'Id'
router.get('/sensor/:id', sensorController.findSensorById);

// ==> Rota responsável por atualizar 'Sensor' pelo 'Id'
router.put('/sensor/:id', sensorController.updateSensorById);

// ==> Rota responsável por excluir 'Sensor' pelo 'Id'
router.delete('/sensor/:id', sensorController.deleteSensorById);

module.exports = router;