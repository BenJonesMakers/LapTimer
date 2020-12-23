var RaceModel = require('../models/raceModel');
var Timing = require('./timing');
var serialport = require('serialport');

var Race = {

    async Creation(raceDetails) {
        
        //adds current date if missing
        if (!raceDetails.date) {
            raceDetails.date = Date.now();
        }

        const raceRecord = await RaceModel.create(raceDetails);
        return raceRecord;
    
    },

    async GetAll() {
        const raceRecords = await RaceModel.find(function(err, races) {
            if (err) { throw err; }
            return races;
          });

        return raceRecords;
    }

}

module.exports = Race;