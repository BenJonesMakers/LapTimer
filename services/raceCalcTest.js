const localRaceStorage = require('node-persist');

var raceCalcTest = {
    getPositions: async () => {

        const raceDetails = {
            uniqueTransponders: null,
            raceData: [],
            startRaceTime: 0
        };

        const totalLapTime = (filteredLaps) => {
            var totalLapTimeByTransponder = filteredLaps.reduce(function (prev, current) {
                return prev + current.laptime
            }, 0);

            return totalLapTimeByTransponder.toFixed(3);
        }

        await localRaceStorage.init();

        let raceMessageArray = await localRaceStorage.getItem('raceMessages');
        raceDetails.uniqueTransponders = [...new Set(raceMessageArray.map(item => item.transponderId))];

        raceDetails.uniqueTransponders.forEach(transponder => {

            let tempLapsArray = raceMessageArray.filter((raceMessage) => {
                return raceMessage.transponderId === transponder;
            });

            const lapsPerTransponder = [];
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
                    lapsPerTransponder.push(driverLap);
                } else {
                    driverLap = {
                        transponderId: raceMessage.transponderId,
                        lapNo: index,
                        laptime: Math.round((currentLap + Number.EPSILON) * 1000) / 1000
                    }
                    currentLap = parseFloat(raceMessage.timeSeconds) - prevLap;
                    lapsPerTransponder.push(driverLap);
                    prevLap = prevLap + currentLap;
                }
            });

            driverEntry = {
                transponderId: transponder,
                totalLaps: lapsPerTransponder.length,
                filteredLaps: lapsPerTransponder,
                totalLapTime: totalLapTime(lapsPerTransponder)
            }
            raceDetails.raceData.push(driverEntry);

        });

        return raceDetails;
    }
}

module.exports = raceCalcTest;