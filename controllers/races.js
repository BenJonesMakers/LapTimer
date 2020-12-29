var Race = require('../services/race');
var Timing = require('../services/timingSystem');

var raceController = {
    New: async (req, res) => {
        const newRace = req.body;

        let savedRace = await Race.creation(newRace);

        res.json({race: savedRace})
        
    },
    
    Index: async (req, res) => {
        let races = await Race.getAll();
        
        res.json(races);
        
    },

    StartRace: async (req, res) => {
        let raceId = '47384274272847';
        let raceLength = 3;
        Race.startRace(raceId, raceLength);
        res.json('Starting Race');
    }
}

module.exports = raceController;
