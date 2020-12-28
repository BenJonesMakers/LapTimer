var RaceModel = require('../models/raceModel');
const Timing = require('./timing');

const localRaceStorage = require('node-persist');

// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('../tempFiles');
//   }

const raceDriver = {
    driverId: null,
    driverName: "",
    lapCount: null,
    lastLap: null,
    lapTimes: [],
    totalTime: null
}

    async function creation(raceDetails) {

        await localRaceStorage.init();
        
        //adds current date if missing
        if (!raceDetails.date) {
            raceDetails.date = Date.now();
        }
        // updates a local race object
        await localRaceStorage.setItem('raceID', raceDetails.name);
        console.log(await localRaceStorage.getItem('raceID'));
        await localRaceStorage.setItem('raceMessages', []);
        await localRaceStorage.setItem('raceIsRunning', false);
        await localRaceStorage.setItem('transponders', []);

        console.log(await localRaceStorage.getItem('raceMessages'));

        //writes the race record to MongoDB
        const raceRecord = await RaceModel.create(raceDetails);

        // updates a local race object
        await localRaceStorage.setItem(
            'raceID', raceRecord._id
        );

        console.log(await localRaceStorage.getItem('raceID'));
        return raceRecord;
    
    }

    async function startRace() {
        // don't run this before creating the race.
        await localRaceStorage.init();

        await localRaceStorage.setItem('raceMessages', []);
        await localRaceStorage.setItem('raceIsRunning', true);
        console.log('attempting race start');
        Timing.openPort();
        
        setTimeout(Timing.closePort(), 3000);

        console.log(await localRaceStorage.getItem('raceMessages'));
    
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