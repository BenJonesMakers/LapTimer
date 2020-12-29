var express = require('express');
var router = express.Router();
var liveRaceController = require('../controllers/liveRace')

router.post('/startrace', liveRaceController.StartRace)
router.get('/', liveRaceController.GetPositions)

module.exports = router;