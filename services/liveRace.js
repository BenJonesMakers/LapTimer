const TimingSystem = require('./timingSystem');
const databaseActions = require('./helpers/databaseActions');
const { v4: uuidv4 } = require('uuid');
module.exports = class LiveRace {
    constructor(raceLength) {
        this.raceID = uuidv4();
        this.raceLength = raceLength;
        this.raceRunning = true;
        this.startTime = null;
        this.finishTime = null;
    }

    async startRace() {


        // create an instance of timing system - pass port number
        const timingSystem = new TimingSystem('COM4');
        timingSystem.openPort(this.raceID);

        // record start times - this needs ot move out and be updated after the countdown possibly
        this.startTime = new Date();

        //write new race details to DB
        databaseActions.createNewRace({
            raceID: this.raceID,
            raceLength: this.raceLength,
            startTime: this.startTime
        });


        // // close the port after race length
        // setTimeout(() => timingSystem.closePort(), (this.raceLength * 60) * 1000);
    }


} // end of class
