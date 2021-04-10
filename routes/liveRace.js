var express = require('express');
var router = express.Router();
var liveRaceController = require('../controllers/liveRace')

router.post('/startrace', liveRaceController.StartRace)
router.get('/', liveRaceController.GetPositions)
router.get('/testrace', liveRaceController.GetTestRaceData)
router.post('/testdata', liveRaceController.TestData)

module.exports = router;