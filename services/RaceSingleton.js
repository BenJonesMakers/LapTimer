const TimingSystemSingleton = require('./TimingSystemSingleton');
const databaseActions = require('./helpers/databaseActions');
const { v4: uuidv4 } = require('uuid');

class PrivateRaceSingleton {
  constructor(raceLength) {
    this.raceID = uuidv4();
    this.raceLength = raceLength;
    this.raceRunning = true;
    this.startTime = null;
    this.finishTime = null;
  }

  async startRace() {
    // create an instance of timing system - pass port number
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.openPort(this.raceID);

    // record start times - this needs ot move out and be updated after the countdown possibly
    this.startTime = new Date();

    //write new race details to DB
    databaseActions.createNewRace({
      raceID: this.raceID,
      raceLength: this.raceLength,
      startTime: this.startTime
    });

  }

  async endRace() {
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.closePort();
  }
}
class RaceSingleton {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }
  static getInstance() {
    if (!RaceSingleton.instance) {
      RaceSingleton.instance = new PrivateRaceSingleton();
    }
    return RaceSingleton.instance;
  }
}
module.exports = RaceSingleton;