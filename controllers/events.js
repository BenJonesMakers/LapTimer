var Event = require('../models/eventSchema');

var eventController = {
    New: (req, res) => {
        var event = new Event({
            date: Date.now(),
            races: [],
            name: req.body.name
        });

        event.save(function(err){
            if(err) {throw err}
        });
        res.json({event: event})
        
    },
    Index: (req, res) => {
        Event.find(function(err, events) {
            if (err) { throw err; }
            res.json({events: events})
          });
    }
}

module.exports = eventController;