const Utilities = require('../services/helpers/utilities');
const RaceSingleton = require('../services/RaceSingleton');
var raceDataGlobal = [];
var currentRaceId = '';
const fixedTransponders = ['1006319', '1003456', '1003666', '1003197'];

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

    GetRaceData: async (req, res) => {
        const race = RaceSingleton.getInstance();
        var raceData = await race.getRaceData();
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
        const result = await Utilities.saveFakeLap(randomTransponder, lastLapTime);
        raceDataGlobal.push(result);

        const race = RaceSingleton.getInstance();
        race.passNewRaceMessage(result);
        res.json(result);
    }

}

module.exports = liveRaceController;