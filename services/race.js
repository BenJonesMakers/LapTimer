var RaceModel = require('../models/raceModel');
let serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
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
      
        console.log('Im listening to port: ', portToUse);
        
        const port = new serialport(portToUse, {
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
            flowControl: false
          })
        
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        parser.on('data', function(data) {

            Timing.messageToObject(data);
        })
    },

    async StopListening (portToClose) {
        
        console.log('Im closing port: ', portToClose);
        
        port.close();

        console.log('port closed');
       
    }

}

module.exports = Race;