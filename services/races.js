var RaceModel = require('../models/raceModel');

    async function creation(raceDetails) {
        
        //adds current date if missing
        if (!raceDetails.date) {
            raceDetails.date = Date.now();
        }

        //writes the race record to MongoDB
        const raceRecord = await RaceModel.create(raceDetails);
        return raceRecord;
    
    }

    async function getAll() {
        const raceRecords = await RaceModel.find(function(err, races) {
            if (err) { throw err; }
            return races;
          });

        return raceRecords;
    }

module.exports.creation = creation;
module.exports.getAll = getAll;