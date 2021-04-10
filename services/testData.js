const generateRandomNumber = require('./helpers/utilities');

function saveFakeLap(transponder, lastLapTime = 0.000) {

    let newLapTime = generateRandomNumber(8.000, 10.000);
    let updatedLapTime = lastLapTime + newLapTime;

    let messageObj = {
        sor: 0x01,
        command: '#',
        decoderId: '202',
        recordSeq: '100',
        transponderId: transponder,
        timeSeconds: updatedLapTime
    }

    return messageObj;
}

module.exports.saveFakeLap = saveFakeLap;
