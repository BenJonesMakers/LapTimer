const plib = require('p3lib');
const SerialPort = require('serialport')

const connectPort = (portName) => {
    const port = new SerialPort(portName, {
        baudRate: 57600
    })
}

const portListener = () => {
    port.on('open', function(){
        console.log('Serial Port Opened');
        port.on('data', function(data){
            console.log(data[0]);
            var decoded = ParserJs.decode(data[0]);
            console.log(decoded);
        });
    });
}

var indexController = {
    Index: (req, res) => {
        res.render('index', { title: 'Express' });
    }
}

module.exports = indexController;