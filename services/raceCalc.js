const localRaceStorage = require('node-persist');

var raceCalc = {
    getPositions: async () => {
        await localRaceStorage.init();

        let raceMessageArray = await localRaceStorage.getItem('raceMessages');
        console.log(raceMessageArray);
        let bensLaps = raceMessageArray.filter((raceMessage) => {
            return raceMessage.transponderId === '1006319';
        });
        console.log('total laps', bensLaps.length - 1);

        // get total race time
        let totalRaceTime = 0;
        let startRaceTime = 0;
        let laps = [];

        var prevLap = 0;
        var currentLap = 0;

        bensLaps.forEach(raceMessage => {
            
            if (startRaceTime === 0) {
                console.log('first entry sets start time');
                startRaceTime = parseFloat(raceMessage.timeSeconds);
                prevLap = startRaceTime;
                laps.push(0);
            } else {
                currentLap = parseFloat(raceMessage.timeSeconds) - prevLap;
                laps.push(Math.round((currentLap + Number.EPSILON) * 1000) / 1000 );
                prevLap = prevLap + currentLap;
            }
        });
        console.log(laps);
        console.log('start time: ', startRaceTime);
        console.log('total time: ', Math.round((totalRaceTime + Number.EPSILON) * 1000) / 1000 );
    }
}

module.exports = raceCalc;