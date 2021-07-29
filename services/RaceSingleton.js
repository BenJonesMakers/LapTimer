const TimingSystemSingleton = require('./TimingSystemSingleton');
const { v4: uuidv4 } = require('uuid');
const Driver = require('./Driver');
const databaseActions = require('./helpers/databaseActions');

async function getAllTheDrivers() {
  return await Driver.GetAll();
}

function sortedRaceData(raceData) {
  if (raceData && raceData.length) {
    return raceData
      .sort((a, b) => {
        // Sorts first by number of laps and then by shortest time
        var n = b.totalLaps - a.totalLaps;
        if (n !== 0) {
          return n;
        }
        return a.totalTime - b.totalTime;
      });
  }
};
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
    this.fastestLapTransponder = '';
    this.allDrivers = [];
  }

  async startRace() {

    this.raceID = uuidv4();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.openPort(this);
    this.raceRunning = true;
    this.startTime = new Date();
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
        this.fastestLapTransponder = transponder;
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
      raceData: sortedRaceData(this.racers), // was this.racers,
      fastestLap: {
        transponder: this.fastestLapTransponder,
        lapTime: this.fastestLap
      }
    };
  }

  async endRace() {
    // Get the last laps etc
    console.log('sortedFinalData', sortedRaceData(this.racers));

    // clean up after 10 seconds
    // TODO: work out how to end either when everyone has finshed or after 10 seconds.
    setTimeout(() => {
      this.raceRunning = false;
      this.finishTime = new Date();
      const timingSystem = TimingSystemSingleton.getInstance();
      timingSystem.closePort();

      // write race details to DB
      databaseActions.createNewRace({
        raceID: this.raceID,
        raceLength: this.raceLength,
        startTime: this.startTime,
        racers: this.racers,
        uniqueTransponders: this.uniqueTransponders,
        fastestLap: this.fastestLap,
        fastestLapTransponder: this.fastestLapTransponder,
      });

      // cleanup
      this.racers = [];
      this.uniqueTransponders = [];
    }, 10000);
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