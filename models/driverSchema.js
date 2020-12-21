  var mongoose = require('mongoose');

var DriverSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    transponderId: {
        type: String
    },

    name: {
        type: String
    }

});

const Driver = mongoose.model("driver", DriverSchema);

module.exports = Driver;