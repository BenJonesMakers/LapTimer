const TimingSystemSingleton = require('./TimingSystemSingleton');
const { v4: uuidv4 } = require('uuid');
const Driver = require('./driver');

async function getAllTheDrivers() {
  return await Driver.GetAll();
}
class PrivateRaceSingleton {
  constructor(raceLength) {
    this.raceID = '0000';
    this.raceLength = raceLength;
    this.raceRunning = false;
    this.startTimeStamp = null;
    this.finishTime = null;
    this.racers = [];
    this.uniqueTransponders = [];
    this.fastestLap = 999999;
    this.fatstestLapTransponder = '';
    this.allDrivers = [];
  }

  async startRace() {

    this.raceID = uuidv4();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.openPort(this);
    this.raceRunning = true;

    // record start time of the race (not the first message time)
    this.startTime = new Date();

    //write new race details to DB - will remove
    // databaseActions.createNewRace({
    //   raceID: this.raceID,
    //   raceLength: this.raceLength,
    //   startTime: this.startTime
    // });
    this.allDrivers = await getAllTheDrivers();
  }

  async passNewRaceMessage(message) {
    const transponder = message.transponderId.toString();
    const messageTime = parseFloat(message.timeSeconds);

    // check if we have an object for this transponder, if we do update if not create one:
    let foundRacer;
    if (this.racers.length) {
      foundRacer = this.racers.find(racer => racer.transponderId === transponder);
    }

    if (foundRacer) {
      let foundIndex = this.racers.indexOf(foundRacer);
      const laptime = messageTime - this.racers[foundIndex].previousLapStartTime;
      this.racers[foundIndex].previousLapStartTime = messageTime;
      this.racers[foundIndex].totalTime += laptime;
      this.racers[foundIndex].totalLaps += 1;

      // update the laps sub array
      this.racers[foundIndex].laps.push(
        {
          transponderId: transponder,
          lapNo: this.racers[foundIndex].totalLaps,
          laptime: laptime
        }
      );

      // check if this is the new fastest lap
      if (laptime <= this.fastestLap) {
        this.fastestLap = laptime;
        this.fatstestLapTransponder = transponder;
      }

    } else {
      this.uniqueTransponders.push(transponder);

      let racerNameFromDB;
      this.allDrivers.forEach(driver => {
        if (driver.transponderId == transponder) {
          racerNameFromDB = driver.realName;
        }
      });

      this.racers.push({
        transponderId: transponder,
        racerName: racerNameFromDB,
        lapZeroStartTime: message.timeSeconds,
        previousLapStartTime: message.timeSeconds,
        totalLaps: 0,
        laps: [],
        totalTime: 0
      })

    }
  }

  async getRaceData() {
    return {
      raceID: this.raceID,
      uniqueTransponders: this.uniqueTransponders,
      raceData: this.racers,
      fastestLap: {
        transponder: this.fatstestLapTransponder,
        lapTime: this.fastestLap
      }
    };
  }

  async endRace() {
    this.raceRunning = false;
    this.finishTime = new Date();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.closePort();
    // cleanup
    this.racers = [];
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