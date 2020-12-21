var Event = require('../services/event');

var eventController = {
    New: async (req, res) => {
        const newEvent = req.body;

        let savedEvent = await Event.Creation(newEvent);

        res.json({event: savedEvent})
        
    },
    
    Index: async (req, res) => {
        let events = await Event.GetAll();
        
        res.json(events);
        
    }
}

module.exports = eventController;
