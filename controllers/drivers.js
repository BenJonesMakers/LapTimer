var Driver = require('../services/driver');

var driverController = {
    New: async (req, res) => {
        const newDriver = req.body;

        let savedDriver = await Driver.Signup(newDriver);

        res.json({driver: savedDriver})
        
    },
    
    Index: async (req, res) => {
        let drivers = await Driver.GetAll();
        
        res.json(drivers);
        
    }
}

module.exports = driverController;