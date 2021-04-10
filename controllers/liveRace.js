var LiveRace = require('../services/liveRace');
var RaceCalc = require('../services/raceCalc');
var RaceCalcTest = require('../services/raceCalcTest');
var TestData = require('../services/testData');
var raceDataGlobal = [];
const fixedTransponders = ['1006319', '1003456', '1003666']

var liveRaceController = {

    StartRace: async (req, res) => {
        let raceId = '47384274272847';
        let raceLength = 1;
        //create instance of liveRace class.
        const liveRace = new LiveRace(raceId, raceLength)

        //start the race using liveRaceInstance.start()
        liveRace.startRace();

        res.json('Starting Race ' + raceId);
    },

    GetPositions: async (req, res) => {
        var laps = await RaceCalc.getPositions();
        res.json(laps);
    },

    GetTestRaceData: async (req, res) => {
        var raceData = await RaceCalcTest.getPositions(raceDataGlobal);
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
        res.json(result);
    }

}

module.exports = liveRaceController;