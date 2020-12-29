const localRaceStorage = require('node-persist');

var raceCalc = {
    getPositions: async () => {

        const raceDetails = {
            laps: [],
            startRaceTime: 0
        };
        await localRaceStorage.init();

        let raceMessageArray = await localRaceStorage.getItem('raceMessages');
        let bensLaps = raceMessageArray.filter((raceMessage) => {
            return raceMessage.transponderId === '1006319';
        });
        console.log('total laps', bensLaps.length - 1);

        // get total race time
        let totalRaceTime = 0;
        // var laps = [];
        var prevLap = 0;
        var currentLap = 0;

        bensLaps.forEach(raceMessage => {
            
            if (raceDetails.startRaceTime === 0) {
                console.log('first entry sets start time');
                raceDetails.startRaceTime = parseFloat(raceMessage.timeSeconds);
                prevLap = raceDetails.startRaceTime;
                raceDetails.laps.push(0);
            } else {
                currentLap = parseFloat(raceMessage.timeSeconds) - prevLap;
                raceDetails.laps.push(Math.round((currentLap + Number.EPSILON) * 1000) / 1000 );
                prevLap = prevLap + currentLap;
            }
        });

        // raceDetails.driverLaps = laps;
        // raceDetails.setItem('startTime', startRaceTime);
        console.log('total time: ', Math.round((totalRaceTime + Number.EPSILON) * 1000) / 1000 );
        
        return raceDetails;
    }
}

module.exports = raceCalc;