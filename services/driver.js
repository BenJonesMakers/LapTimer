var DriverModel = require('../models/driverModel');

var Driver = {

    async Signup(user) {

        const driverRecord = await DriverModel.create(user);
        return driverRecord;
    
    },

    async GetAll() {
        const driverRecords = await DriverModel.find(function(err, drivers) {
            if (err) { throw err; }
            return drivers;
          });

        return driverRecords;
    }
}

module.exports = Driver;