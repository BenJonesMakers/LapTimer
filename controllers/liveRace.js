var LiveRace = require('../services/liveRace');
var RaceCalc = require('../services/raceCalc');
var RaceCalcTest = require('../services/raceCalc');
var TestData = require('../services/testData');
var raceDataGlobal = [];
var currentRaceId = '';
const fixedTransponders = ['1006319', '1003456', '1003666'];
const databaseActions = require('../services/helpers/databaseActions');

var liveRaceController = {

    StartRace: async (req, res) => {
        //create instance of liveRace class.
        const liveRace = new LiveRace(3);

        //start the race using liveRaceInstance.start()
        liveRace.startRace();

        currentRaceId = liveRace.raceID;

        res.json('Starting Race ' + liveRace.raceID);
    },

    // GetPositions: async (req, res) => {
    //     var laps = await RaceCalc.getPositions();
    //     res.json(laps);
    // },

    GetTestRaceData: async (req, res) => {
        var raceDataDB = await RaceCalcTest.getRaceDataFromDB(currentRaceId);
        var raceData = await RaceCalcTest.getPositions(raceDataDB);
        // var raceData = await RaceCalcTest.getPositions(raceDataGlobal);
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