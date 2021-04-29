var raceCalcTest = {
    getPositions: async (raceMessageArray) => {

        const raceDetails = {
            uniqueTransponders: [],
            raceData: [],
            startRaceTime: 0,
            fastestLap: {
                transponder: '',
                lapTime: 20
            }
        };

        const totalLapTime = (filteredLaps) => {
            var totalLapTimeByTransponder = filteredLaps.reduce(function (prev, current) {
                return prev + current.laptime
            }, 0);

            return totalLapTimeByTransponder.toFixed(3);
        }

        if (raceMessageArray.length) {
            raceDetails.uniqueTransponders = [...new Set(raceMessageArray.map(item => item.transponderId))];
        }

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
                        laptime: raceDetails.startRaceTime
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

                    if (currentLap <= raceDetails.fastestLap.lapTime) {
                        raceDetails.fastestLap.lapTime = currentLap;
                        raceDetails.fastestLap.transponder = raceMessage.transponderId;
                    }
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

        //raceDetails.raceData.sort((a, b) => b.laps - a.laps);

        return raceDetails;
    }
}

module.exports = raceCalcTest;