var LiveRace = require('../services/liveRace');
var RaceCalc = require('../services/raceCalc');

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
    }

}

module.exports = liveRaceController;