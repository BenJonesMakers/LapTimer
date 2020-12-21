var express = require('express');
var router = express.Router();
var driverController = require('../controllers/drivers')

/* GET drivers listing. */
router.get('/', driverController.Index)
router.post('/new', driverController.New)

module.exports = router;
