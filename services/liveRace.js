const localRaceStorage = require('node-persist');
const TimingSystem = require('./timingSystem');

module.exports = class LiveRace {
    constructor(raceID, raceLength) {
        this.raceID = raceID;
        this.raceLength = raceLength;
        this.raceRunning = true;
        this.startTime = null;
        this.finishTime = null;
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

        // create an instance of timing system - pass port number
        const timingSystem = new TimingSystem('COM4');

        // use open port method to listen for data event
        timingSystem.openPort();

        // record start and end times
        this.startTime = new Date();
        this.finshTime = new Date();
        this.finshTime.setMinutes(this.finshTime.getMinutes() + this.raceLength);
        console.log('Start ', this.startTime);
        console.log('Finish ', this.finshTime);

        // close the port after race length
        setTimeout(() => timingSystem.closePort(), (this.raceLength * 60) * 1000);
    }


} // end of class
