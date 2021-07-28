const databaseActions = require('./helpers/databaseActions');

var Driver = {

    async Signup(transponderId, realName) {
        if (transponderId && realName) {
            databaseActions.saveNewDriver(transponderId, realName);
        } else {
            console.log('No Data Recieved');
        }
    },

    async GetAll() {
        return databaseActions.getAllDrivers();
    }

}
module.exports = Driver;