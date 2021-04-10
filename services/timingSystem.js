const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
const localRaceStorage = require('node-persist');
const { model } = require('../models/raceModel');

module.exports = class TimimgSystem {
    constructor(foundTransponderPort) {
        this.foundTransponderPort = foundTransponderPort;
        this.port = '';
    }

    getPortStatus () {
        if (!port) {
            return 'no port defined'
        } else {
            return port.path;
        }
    }

    openPort () {
        console.log('Attempting to listen on port: ', this.foundTransponderPort);
        
            this.port = new serialport(this.foundTransponderPort, {
                baudRate: 9600,
                stopBits: 1,
                parity: 'none',
                dataBits: 8,
                flowControl: false
              }, function(error) {
                console.log(error);
              })

            if (this.port) {
                console.log('port open waiting for data');
                const parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
                parser.on('data', function(data) {
                    messageToObject(data);
                })
            }  
    }

    closePort () {
        
        console.log('Attempting to close the port');
        console.log(this.port.path);
        if (this.port) {
            this.port.close();
            console.log('Port closed');
        } else {
            console.log('Port not available');
        }
    }

} // end of class

async function messageToObject (message) {

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
        // add in saving to localstorage here.
        console.log(messageObj);
        //if (localRaceStorage.raceMessages) {
            let tempArray = await localRaceStorage.getItem('raceMessages');
            tempArray.push(messageObj);
            await localRaceStorage.setItem('raceMessages', tempArray);
        //}
    } else if (messageTabs[0].substring(1,3) === '#') {
        console.log('keepalive', messageTabs);
    }

    return messageObj;
}


    async function ListPorts () {
        // list serial ports:
        
        await serialport.list().then((ports) => {

            ports.forEach(function(port) {
                askPort(port.path)
            });

        })

        return foundTransponderPort;
    }

    function askPort (portToAsk) {
        
        console.log('Asking port : ', portToAsk)

        testPort = new serialport(portToAsk, {
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
            flowControl: false,
            autoOpen: false
          }, false);

            if (testPort) {
                const parser = testPort.pipe(new Readline({ delimiter: '\r\n' }));
                parser.on('data', function(data) {
                    const messageTabs = data.split('\t');
                    console.log(messageTabs);
                    if (messageTabs[0].substring(1,3) === '$') {
                        console.log('This is your transponder port: ', testPort.path)
                        testPort.close();
                        foundTransponderPort = testPort.path;
                    } else {
                        testPort.close();
                    }
                 
                })
                var arr =[];
                arr[0] = 0x01;
                arr[1] = 0x3F;
                arr[2] = 0x09;
                arr[3] = 0;
                arr[4] = 0x09;
                arr[5] = 0;
                arr[6] = 0x09;
                arr[7] = 33;
                arr[8] = 0x09;
                arr[9] = 0x0D;
                arr[10] = 0x0A;

                testPort.open(function (error) {
                    if (error) {
                        console.log('error while oppening the port ' + error);
                    } else if (testPort.isOpen) {
                        console.log('port is open');
                        testPort.write(Buffer.from(arr));
                    }
                });
                
            }  
        
        
    }