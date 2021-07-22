var express = require('express');
var router = express.Router();
var liveRaceController = require('../controllers/liveRace')

router.post('/startrace', liveRaceController.StartRace)
router.post('/endrace', liveRaceController.EndRace)
router.get('/racedata', liveRaceController.GetRaceData)
router.post('/generatetestlap', liveRaceController.GenerateTestLap)

module.exports = router;