var RaceModel = require('../models/raceModel');
const LiveRace = require('./liveRace');

    async function creation(raceDetails) {
        
        //adds current date if missing
        if (!raceDetails.date) {
            raceDetails.date = Date.now();
        }

        //writes the race record to MongoDB
        const raceRecord = await RaceModel.create(raceDetails);
        return raceRecord;
    
    }

    async function startRace(raceID, raceLength) {

        //create instance of liveRace class.
        const liveRace = new LiveRace(raceID, raceLength) 
        
        //start the race using liveRaceInstance.start()
        liveRace.startRace(); 
        // DO THE REST FROM THE CLIENT
        // Client polls an API route (not liveclientInstance) 
        //that has to read back from the localstorage and report back.
    
    }

    async function getAll() {
        const raceRecords = await RaceModel.find(function(err, races) {
            if (err) { throw err; }
            return races;
          });

        return raceRecords;
    }

module.exports.creation = creation;
module.exports.startRace = startRace;
module.exports.getAll = getAll;