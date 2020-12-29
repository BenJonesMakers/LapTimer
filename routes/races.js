var express = require('express');
var router = express.Router();
var raceController = require('../controllers/races')

router.get('/', raceController.Index)
router.post('/new', raceController.New)
router.post('/startrace', raceController.StartRace)

module.exports = router;