var RaceModel = require('../models/raceModel');
let serialport = require('serialport');
var plib = require('p3lib');
const Readline = require('@serialport/parser-readline')
const ByteLength = require('@serialport/parser-byte-length')
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
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
            flowControl: false
          })
        
        recData = [];
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
        //const parser = port.pipe(new ByteLength({length: 64}))
        parser.on('data', function(data) {
            
            recData.push(data.toString());
            console.log(recData);
        })
        
        
        
        
        
        // port.on('open', function(){
        //     console.log('Serial Port Opened');
        //     port.on('data', function(data){
        //         console.log('data: ', data);
        //         console.log('data at array 0: ', data[0]);
        //         //var decoded = ParserJs.decode(data);
        //         //console.log('decoded', decoded);
        //         var decodedTest = ParserJs.decode("8e023300e5630000010001047a00000003041fd855000408589514394cd8040005026d0006025000080200008104501304008f");
        //         console.log('decodedTest', decodedTest);
        //     });
        // });
        
    }
}

module.exports = Race;