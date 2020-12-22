var RaceModel = require('../models/raceModel');
var Timing = require('./timing');

var Race = {

    async Creation(raceDetails) {
        
        //adds current date if missing
        if (!raceDetails.date) {
            raceDetails.date = Date.now();
        }

        const raceRecord = await RaceModel.create(raceDetails);
        return raceRecord;
    
    },

    async GetAll() {
        const raceRecords = await RaceModel.find(function(err, races) {
            if (err) { throw err; }
            return races;
          });

        return raceRecords;
    },

    async ListPorts () {
        // list serial ports:
        
        const allPorts = await serialport.list().then((ports) => {

            tempPorts = [];

            ports.forEach(function(port) {
               tempPorts.push(port.path);
            });
            return tempPorts;
        })
        
        return allPorts;
    },

    async StartListening (portToUse) {
      
        Timing.openPort(portToUse)
    },

    async StopListening () {
        
        console.log('Im closing port: ', Timing.getPortStatus());
        
        Timing.closePort();

        console.log('port closed');
       
    }

}

module.exports = Race;