var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },

    races: {
        type: Array
    },

    name: {
        type: String
    }

});

const Event = mongoose.model("event", EventSchema);

module.exports = Event;