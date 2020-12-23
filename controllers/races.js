var Race = require('../services/race');
var Timing = require('../services/timing');

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
        const ports = await Timing.ListPorts()
        if (ports) {
            res.json({comPorts: ports});
        }
    },

    StartListening: async (req, res) => {
        portToUse = req.params.portId;
        Timing.openPort(portToUse);
        res.json(Timing.getPortStatus());
    },

    StopListening: async (req, res) => {
        Timing.closePort();
        res.json('Listening stopped');
    }
}

module.exports = raceController;
