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

        // create an instance of timing system - pass port number
        const timingSystem = new TimingSystem('COM4');

        // use open port method to listen for data event
        timingSystem.openPort(this.raceID);

        // record start and end times
        // this.startTime = new Date();
        // this.finshTime = new Date();
        // this.finshTime.setMinutes(this.finshTime.getMinutes() + this.raceLength);

        // // close the port after race length
        // setTimeout(() => timingSystem.closePort(), (this.raceLength * 60) * 1000);
    }


} // end of class
