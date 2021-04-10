var LiveRace = require('../services/liveRace');
var RaceCalc = require('../services/raceCalc');
var RaceCalcTest = require('../services/raceCalcTest');
var TestData = require('../services/testData');

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
        var laps = await RaceCalcTest.getPositions();
        res.json(laps);
    },

    TestData: async (req, res) => {
        TestData.storeTestData();
        res.json('Added Local Test Data');
    }

}

module.exports = liveRaceController;