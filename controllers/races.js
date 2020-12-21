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
        
    },

    ListPorts: async (req, res) => {
        const ports = await Race.ListPorts()
        if (ports) {
            res.json({commPorts: ports});
        }
    },

    StartListening: async (req, res) => {
        portToUse = req.params.portId;
        console.log(portToUse);
        Race.StartListening(portToUse);

        res.json('Listening on ' + portToUse );
        // const ports = await Race.ListPorts()
        // if (ports) {
        //     res.json({commPorts: ports});
        // }
    }
}

module.exports = raceController;
