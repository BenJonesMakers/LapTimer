let serialport = require('serialport');
const Readline = require('@serialport/parser-readline');

let port = null;

var Timing = {

    messageToObject: function (message) {

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
    },

    getPortStatus: function () {
        if (!port) {
            return 'no port defined'
        } else {
            return port.path;
        }
    },

    openPort: function (portToUse) {
        console.log('Attempting to listen on port: ', portToUse);
        
            port = new serialport(portToUse, {
                baudRate: 9600,
                stopBits: 1,
                parity: 'none',
                dataBits: 8,
                flowControl: false
              }, function(error) {
                console.log(error);
                port = null;
              })

            if (port) {
                const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
                parser.on('data', function(data) {
                    Timing.messageToObject(data);
                })
            }  
    },

    closePort: function () {
        
        console.log('Attempting to close the port');
        if (port) {
            port.close();
            console.log('Port closed');
        } else {
            console.log('Port not available');
        }
        
        
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
    }
}

module.exports =  Timing;