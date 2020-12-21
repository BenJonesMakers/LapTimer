var mongoose = require('mongoose');

var RaceSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },

    drivers: {
        type: Array
    },

    name: {
        type: String
    }

});

const Race = mongoose.model("race", RaceSchema);

module.exports = Race;