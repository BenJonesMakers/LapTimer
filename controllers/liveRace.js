var RaceCalc = require('../services/raceCalc');
var TestData = require('../services/testData');
var raceDataGlobal = [];
var currentRaceId = '';
const fixedTransponders = ['1006319', '1003456', '1003666'];
const databaseActions = require('../services/helpers/databaseActions');
const RaceSingleton = require('../services/RaceSingleton');

const liveRaceController = {

    StartRace: async (req, res) => {

        const race = RaceSingleton.getInstance();
        race.startRace();

        currentRaceId = race.raceID;

        res.json('Starting Race ' + race.raceID);
    },
    EndRace: async (req, res) => {

        const race = RaceSingleton.getInstance();
        race.endRace();

        res.json('Ending Race ' + race.raceID);
    },

    GetTestRaceData: async (req, res) => {
        var raceDataDB = await RaceCalc.getRaceDataFromDB(currentRaceId);
        var raceData = await RaceCalc.getPositions(raceDataDB, currentRaceId);
        res.json(raceData);
    },

    GenerateTestLap: async (req, res) => {

        let lastLapTime = 0.000;
        const randomTransponder = fixedTransponders[Math.floor(Math.random() * fixedTransponders.length)];
        const thisTransponderTimes = raceDataGlobal.filter(transponder =>
            transponder.transponderId === randomTransponder);

        if (thisTransponderTimes.length) {
            lastLapTime = thisTransponderTimes[thisTransponderTimes.length - 1].timeSeconds
        }
        const result = await TestData.saveFakeLap(randomTransponder, lastLapTime);
        raceDataGlobal.push(result);

        const messageAsAString = JSON.stringify(result);

        databaseActions.insertRaceMessage(currentRaceId, messageAsAString);

        res.json(result);
    }

}

module.exports = liveRaceController;