var express = require('express');
var router = express.Router();
var raceController = require('../controllers/races')

router.get('/', raceController.Index)
router.post('/new', raceController.New)

router.get('/listports', raceController.ListPorts)
router.put('/startlistening/:portId', raceController.StartListening)

module.exports = router;