var EventModel = require('../models/eventModel');

var Event = {

    async Creation(eventDetails) {
        
        //adds current date if missing
        if (!eventDetails.date) {
            eventDetails.date = Date.now();
        }

        const eventRecord = await EventModel.create(eventDetails);
        return eventRecord;
    
    },

    async GetAll() {
        const eventRecords = await EventModel.find(function(err, events) {
            if (err) { throw err; }
            return events;
          });

        return eventRecords;
    }
}

module.exports = Event;