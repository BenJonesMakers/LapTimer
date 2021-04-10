const localRaceStorage = require('node-persist');

var raceCalc = {
    getPositions: async () => {

        const raceDetails = {
            uniqueTransponders: null,
            laps: [],
            startRaceTime: 0
        };
        await localRaceStorage.init();

        let raceMessageArray = await localRaceStorage.getItem('raceMessages');
        raceDetails.uniqueTransponders = [...new Set(raceMessageArray.map(item => item.transponderId))];

        raceDetails.uniqueTransponders.forEach(transponder => {

            let tempLapsArray = raceMessageArray.filter((raceMessage) => {
                return raceMessage.transponderId === transponder;
            });

            var prevLap = 0;
            var currentLap = 0;

            tempLapsArray.forEach((raceMessage, index) => {

                if (raceDetails.startRaceTime === 0) {
                    console.log('first entry sets start time');
                    raceDetails.startRaceTime = parseFloat(raceMessage.timeSeconds);
                    prevLap = raceDetails.startRaceTime;
                    driverLap = {
                        transponderId: raceMessage.transponderId,
                        lapNo: index,
                        laptime: 0
                    }
                    raceDetails.laps.push(driverLap);
                } else {
                    driverLap = {
                        transponderId: raceMessage.transponderId,
                        lapNo: index,
                        laptime: Math.round((currentLap + Number.EPSILON) * 1000) / 1000
                    }
                    currentLap = parseFloat(raceMessage.timeSeconds) - prevLap;
                    raceDetails.laps.push(driverLap);
                    prevLap = prevLap + currentLap;
                }
            });

        });

        return raceDetails;
    }
}

module.exports = raceCalc;