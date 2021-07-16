const sqlite3 = require('sqlite3').verbose();
const databaseActions = require('./helpers/databaseActions');

var raceCalc = {
    getPositions: async (raceMessageArray, raceID) => {

        const raceDetails = {
            raceID: raceID,
            uniqueTransponders: [],
            raceData: [],
            startRaceTime: databaseActions.getRaceStartFromDB(raceID),
            fastestLap: {
                transponder: '',
                lapTime: 9999
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

                if (raceDetails.startRaceTime === undefined) {
                    console.log('first entry sets start time for ', raceMessage.transponderId, raceDetails.startRaceTime);
                    databaseActions.updateRaceStartTime(raceID, parseFloat(raceMessage.timeSeconds));
                    raceDetails.startRaceTime = parseFloat(raceMessage.timeSeconds);
                    prevLap = raceDetails.startRaceTime;

                    driverLap = {
                        transponderId: raceMessage.transponderId,
                        lapNo: index,
                        laptime: parseFloat(raceMessage.timeSeconds)
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

        raceDetails.raceData.sort((a, b) => b.totalLaps - a.totalLaps);

        return raceDetails;
    },

    getRaceDataFromDB: (raceID) => {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database('./db/races.db');
            let sql = `SELECT * FROM session_messages WHERE raceid = '${raceID}'`;
            const sessionData = [];

            db.all(sql, [], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                rows.forEach((row) => {
                    sessionData.push(JSON.parse(row.message));
                });
                resolve(sessionData);
            });

            db.close();

        })

    }
}

module.exports = raceCalc;