var LiveRace = require('../services/liveRace');
var RaceCalc = require('../services/raceCalc');
var RaceCalcTest = require('../services/raceCalcTest');
var TestData = require('../services/testData');
var raceDataGlobal = [];
const fixedTransponders = ['1006319', '1003456', '1003666'];
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/races.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the Races database (fakelap).');
    }
});

var liveRaceController = {

    StartRace: async (req, res) => {
        let raceId = uuidv4();
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
        var raceDataDB = await RaceCalcTest.getRaceDataFromDB('test');
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
        //test
        const messageAsAString = JSON.stringify(result);
        const messageParams = {
            $raceid: this.raceId || 'test',
            $message: messageAsAString
        }
        const sql = 'INSERT INTO session_messages(raceid, message) VALUES($raceid ,$message)';
        db.run(sql, messageParams, ['C'], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        res.json(result);
    }

}

module.exports = liveRaceController;