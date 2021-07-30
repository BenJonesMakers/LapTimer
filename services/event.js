const databaseActions = require('./helpers/databaseActions');

var Event = {

    async Creation(eventDetails) {

    },

    async GetAll() {
        return databaseActions.getAllRaces();
    }
}

module.exports = Event;