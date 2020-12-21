var Race = require('../services/race');

var raceController = {
    New: async (req, res) => {
        const newRace = req.body;

        let savedRace = await Race.Creation(newRace);

        res.json({race: savedRace})
        
    },
    
    Index: async (req, res) => {
        let races = await Race.GetAll();
        
        res.json(races);
        
    }
}

module.exports = raceController;
