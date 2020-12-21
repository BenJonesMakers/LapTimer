var express = require('express');
var router = express.Router();
var eventController = require('../controllers/events')

router.get('/', eventController.Index)
router.post('/new', eventController.New)

module.exports = router;