var Race = require('../services/races');

var raceController = {
    New: async (req, res) => {
        const newRace = req.body;

        let savedRace = await Race.creation(newRace);

        res.json({race: savedRace})
        
    },
    
    Index: async (req, res) => {
        let races = await Race.getAll();
        
        res.json(races);
        
    }

}

module.exports = raceController;
