var Driver = require('../models/driverSchema');

var driverController = {
    New: (req, res) => {
        var driver = new Driver({
            email: req.body.email,
            transponderId: req.body.transponderId,
            name: req.body.name
        });

        driver.save(function(err){
            if(err) {throw err}
        });
        res.json({driver: driver})
        
    },
    Index: (req, res) => {
        Driver.find(function(err, driver) {
            if (err) { throw err; }
            res.json({driver: driver})
          });
    }
}

module.exports = driverController;