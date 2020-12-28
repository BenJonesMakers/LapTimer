let serialport = require('serialport');
const Readline = require('@serialport/parser-readline');

const localRaceStorage = require('node-persist');

 var port = '';
 var foundTransponderPort = '';

    function messageToObject  (message) {

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
            if (localRaceStorage.raceMessages) {
                localRaceStorage.raceMessages.push(messageObj.transponderId);
            }
        } else if (messageTabs[0].substring(1,3) === '#') {
            console.log('keepalive', messageTabs);
        }

        return messageObj;
    }

    function getPortStatus () {
        if (!port) {
            return 'no port defined'
        } else {
            return port.path;
        }
    }

    function openPort (foundTransponderPort) {
        console.log('Attempting to listen on port: ', foundTransponderPort);
        
            port = new serialport(foundTransponderPort, {
                baudRate: 9600,
                stopBits: 1,
                parity: 'none',
                dataBits: 8,
                flowControl: false
              }, function(error) {
                console.log(error);
              })

            if (port) {
                const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
                parser.on('data', function(data) {
                    messageToObject(data);
                })
            }  
    }

    function closePort () {
        
        console.log('Attempting to close the port');
        console.log(port.path);
        if (port) {
            port.close();
            console.log('Port closed');
        } else {
            console.log('Port not available');
        }
        
        
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


module.exports.getPortStatus =  getPortStatus;
module.exports.openPort =  openPort;
module.exports.closePort =  closePort;
module.exports.ListPorts =  ListPorts;
module.exports.askPort =  askPort;