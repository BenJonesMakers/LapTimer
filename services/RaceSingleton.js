const TimingSystemSingleton = require('./TimingSystemSingleton');
// const raceProcessing = require('./helpers/raceProcessing');
const { v4: uuidv4 } = require('uuid');

class PrivateRaceSingleton {
  constructor(raceLength) {
    this.raceID = '0000';
    this.raceLength = raceLength;
    this.raceRunning = false;
    this.startTimeStamp = null;
    this.finishTime = null;
    this.racers = {};
    this.uniqueTransponders = [];
  }

  async startRace() {

    this.raceID = uuidv4();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.openPort(this.raceID);
    this.raceRunning = true;

    // record start time of the race (not the first message time)
    this.startTime = new Date();

    //write new race details to DB - will remove
    // databaseActions.createNewRace({
    //   raceID: this.raceID,
    //   raceLength: this.raceLength,
    //   startTime: this.startTime
    // });

  }

  async passNewRaceMessage(message) {
    const transponder = message.transponderId.toString();
    const messageTime = parseFloat(message.timeSeconds);

    // check if we have an object for this transponder, if we do update if not create one:
    if (this.racers[transponder]) {
      const laptime = messageTime - this.racers[transponder].previousLapStartTime;

      console.log('transponder being logged', transponder);
      console.log('messageTime being logged', messageTime);
      console.log('laptime being logged', laptime);

      // first overwrite the previous start time
      this.racers[transponder].previousLapStartTime = messageTime;
      // second update their new total
      this.racers[transponder].totalTime += laptime;
      // third update their total no of laps
      this.racers[transponder].totalLaps += 1;

      // update the laps sub array
      this.racers[transponder].laps.push(
        {
          transponderId: transponder,
          lapNo: this.racers[transponder].totalLaps,
          laptime: laptime
        }
      );


    } else {

      console.log('transponder being added - lap 0 started', transponder);
      this.uniqueTransponders.push(transponder);
      this.racers[transponder] = {
        transponderId: transponder,
        racerName: 'Pip',
        lapZeroStartTime: message.timeSeconds,
        previousLapStartTime: message.timeSeconds,
        totalLaps: 0,
        laps: [],
        totalTime: 0
      }
    }


  }

  async getRaceData() {
    return {
      raceID: this.raceID,
      uniqueTransponders: this.uniqueTransponders,
      raceData: this.racers,
      fastestLap: {
        transponder: '',
        lapTime: 9999
      }
    };
  }

  async endRace() {
    this.raceRunning = false;
    this.finishTime = new Date();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.closePort();
    // cleanup
    this.racers = {};
    this.uniqueTransponders = [];

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