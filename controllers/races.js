var Race = require('../models/raceSchema');

var raceController = {
    New: (req, res) => {
        var race = new Race({
            date: Date.now(),
            drivers: [],
            name: req.body.name
        });

        race.save(function(err){
            if(err) {throw err}
        });
        res.json({race: race})
        
    },
    Index: (req, res) => {
        Race.find(function(err, races) {
            if (err) { throw err; }
            res.json({races: races})
          });
    }
}

module.exports = raceController;