var RaceModel = require('../models/raceModel');
let serialport = require('serialport');
const Readline = require('@serialport/parser-readline')

    //helper functions - will move

    const messageToObject = function (message) {

        const messageTabs = message.split('\t');
        let messageObj = {}
        if (messageTabs[0].substring(1,3) === '@') {
            messageObj = {
                sor: messageTabs[0],
                command: messageTabs[0].substring(1,3),
                decoderId: messageTabs[1],
                recordSeq: messageTabs[2],
                transponderId: messageTabs[3],
                timeSeconds: messageTabs[4]
            }
            console.log(messageObj);
        } else if (messageTabs[0].substring(1,3) === '#') {
            console.log('keepalive', messageTabs);
        }
        return messageObj;
    }

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
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
            flowControl: false
          })
        
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        parser.on('data', function(data) {

            messageToObject(data);
        })
    }

}

module.exports = Race;