var RaceModel = require('../models/raceModel');
let serialport = require('serialport');
var plib = require('p3lib');
//const { StartListening } = require('../controllers/races');

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
        // list serial ports:
        console.log('Im listening to port: ', portToUse);
        
        const port = new serialport(portToUse, {
            baudRate: 57600
          })
        
        port.on('open', function(){
            console.log('Serial Port Opened');
            port.on('data', function(data){
                console.log('data: ', data);
                console.log('data at array 0: ', data[0]);
                var decoded = ParserJs.decode(data[0]);
                console.log('decoded', decoded);
            });
        });
        
    }
}

module.exports = Race;