const localRaceStorage = require('node-persist');
const TimingSystem = require('./timingSystem');

module.exports = class LiveRace {
    constructor(raceID, raceLength) {
        this.raceID = raceID;
        this.raceLength = raceLength;
        this.raceRunning = false;
        
    }

    async startRace() {
        await localRaceStorage.init();
        // updates a local race object
        await localRaceStorage.setItem('raceID', this.raceID);
        console.log(await localRaceStorage.getItem('raceID'));
        await localRaceStorage.setItem('raceMessages', []);
        await localRaceStorage.setItem('raceIsRunning', false);
        await localRaceStorage.setItem('transponders', []);
 
        console.log(await localRaceStorage.getItem('raceMessages'));

        //create an instance of timing system - pass port number
        const timingSystem = new TimingSystem('COM4');

        //use open port method to listen for data event
        timingSystem.openPort();

    }
    


}
