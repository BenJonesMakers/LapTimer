const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
const sqlite3 = require('sqlite3').verbose();
const { model } = require('../models/raceModel');
let db = new sqlite3.Database('./db/races.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the Races database.');

        if (!db.run("SELECT name FROM sqlite_master WHERE type='table' AND name='session_messages';")) {
            db.run('CREATE TABLE session_messages(raceid text, message text)');
            console.log('session_messages table created.');
        } else {
            console.log('session_messages table already exists.');
        }
    }
});


module.exports = class TimimgSystem {
    constructor(foundTransponderPort) {
        this.foundTransponderPort = foundTransponderPort;
        this.port = '';
    }

    getPortStatus() {
        if (!port) {
            return 'no port defined'
        } else {
            return port.path;
        }
    }

    openPort(raceID) {
        console.log('Attempting to listen on port: ', this.foundTransponderPort);

        this.port = new serialport(this.foundTransponderPort, {
            baudRate: 9600,
            stopBits: 1,
            parity: 'none',
            dataBits: 8,
            flowControl: false
        }, function (error) {
            console.log(error);
        })

        if (this.port) {
            console.log('port open waiting for data');
            const parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
            parser.on('data', function (data) {
                messageToObject(data, raceID);
            })
        }
    }

    closePort() {

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

async function messageToObject(message, raceID) {

    const messageTabs = message.split('\t');
    let messageObj = {}
    if (messageTabs[0].substring(1, 3) === '@') {
        messageObj = {
            sor: messageTabs[0],
            command: messageTabs[0].substring(1, 3),
            decoderId: messageTabs[1],
            recordSeq: messageTabs[2],
            transponderId: messageTabs[3],
            timeSeconds: messageTabs[4]
        }

        writeMessageObjectToDB(messageObj, RaceID)

    } else if (messageTabs[0].substring(1, 3) === '#') {
        console.log('keepalive', messageTabs);
    }

    return messageObj;
}


async function ListPorts() {
    // list serial ports:

    await serialport.list().then((ports) => {

        ports.forEach(function (port) {
            askPort(port.path)
        });

    })

    return foundTransponderPort;
}

function askPort(portToAsk) {

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
        parser.on('data', function (data) {
            const messageTabs = data.split('\t');
            console.log(messageTabs);
            if (messageTabs[0].substring(1, 3) === '$') {
                console.log('This is your transponder port: ', testPort.path)
                testPort.close();
                foundTransponderPort = testPort.path;
            } else {
                testPort.close();
            }

        })
        var arr = [];
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

    function writeMessageObjectToDB(messageObj, raceID) {
        const messageAsAString = JSON.stringify(messageObj);
        db.run(`INSERT INTO races(session_messages) VALUES(${raceID},${messageAsAString})`, ['C'], function (err) {
            if (err) {
                return console.log(err.message);
            }

        });

        // db.close();
    }

}
