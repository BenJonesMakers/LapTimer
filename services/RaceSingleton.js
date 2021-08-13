const TimingSystemSingleton = require('./TimingSystemSingleton');
const { v4: uuidv4 } = require('uuid');
const Driver = require('./Driver');
const databaseActions = require('./helpers/databaseActions');

function stopFunction() {
  clearInterval(carChecker);
}

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
    this.raceStatusBackend = 'notstarted';
    this.raceLength = raceLength;
    this.raceRunning = false;
    this.startTimeStamp = null;
    this.finishTime = null;
    this.racers = [];
    this.uniqueTransponders = [];
    this.fastestLap = 999999;
    this.fastestLapTransponder = '';
    this.allDrivers = [];
    this.driversFinishedRunning = [];
    this.lastLap = false;
    this.countBeforeEnd = 10;

    this.raceCloseDown = () => {
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
    };
  }

  async startRace() {
    // cleanup
    this.racers = [];
    this.uniqueTransponders = [];
    this.lastLap = false;
    this.driversFinishedRunning = [];
    // starting race
    this.raceID = uuidv4();
    const timingSystem = TimingSystemSingleton.getInstance();
    timingSystem.openPort(this);
    this.raceRunning = true;
    this.raceStatusBackend = 'running';
    this.startTime = new Date();
    this.allDrivers = await getAllTheDrivers();
  }

  async passNewRaceMessage(message) {
    const transponder = message.transponderId.toString();
    const messageTime = parseFloat(message.timeSeconds);
    const isDriverFinished = (passedTransponder) => this.driversFinishedRunning.includes(passedTransponder);

    // check if we have an object for this transponder, if we do update if not create one:
    let foundRacer;
    if (this.racers.length) {
      foundRacer = this.racers.find(racer => racer.transponderId === transponder);
    }

    if (foundRacer) {
      let foundIndex = this.racers.indexOf(foundRacer);
      const laptime = messageTime - this.racers[foundIndex].previousLapStartTime;

      // check if this is the new fastest lap
      if (laptime <= this.fastestLap) {
        this.fastestLap = laptime;
        this.fastestLapTransponder = transponder;
      }


      if (this.lastLap && isDriverFinished(transponder)) return;

      if (this.raceStatusBackend === 'complete') return;

      if (isDriverFinished(transponder)) return;

      if (this.lastLap) {
        console.log('last lap - pushing ', transponder);
        this.driversFinishedRunning.push(transponder);
      }

      this.racers[foundIndex].previousLapStartTime = messageTime;
      this.racers[foundIndex].totalTime += laptime;
      this.racers[foundIndex].totalLaps = this.racers[foundIndex].totalLaps + 1;
      this.racers[foundIndex].laps.push(
        {
          transponderId: transponder,
          lapNo: this.racers[foundIndex].totalLaps,
          laptime: laptime
        }
      );

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
      raceStatusBackend: this.raceStatusBackend,
      uniqueTransponders: this.uniqueTransponders,
      raceData: sortedRaceData(this.racers), // was this.racers,
      fastestLap: {
        transponder: this.fastestLapTransponder,
        lapTime: this.fastestLap
      }
    };
  }

  async endRace() {

    this.lastLap = true;
    this.raceStatusBackend = 'finishing';
    // idea for this: create an array with all the racers and pop them off as they complete the last lap
    // starting with the winner.
    if (this.racers && this.racers.length > 0) {
      const winingTransponder = sortedRaceData(this.racers)[0].transponderId;
      console.log('pushing winning transponder - ', winingTransponder);
      this.driversFinishedRunning.push(winingTransponder);
    }
    // clean up after 10 seconds or all drivers are finished
    function stopFunction() {
      clearInterval(carChecker);
    }

    let carChecker = setInterval(() => { checkAllCarsFinished() }, 1000);

    const checkAllCarsFinished = () => {
      console.log('checking all cars');
      this.countBeforeEnd--;
      console.log('countdownNum', this.countBeforeEnd);
      if (this.countBeforeEnd > 0) {
        console.log('drivers finished', this.driversFinishedRunning);
        if (this.driversFinishedRunning.length === this.uniqueTransponders.length) {
          stopFunction();
          this.countBeforeEnd = 10;
          this.raceStatusBackend = 'complete';
          this.raceCloseDown();
        }
      } else {
        stopFunction();
        this.countBeforeEnd = 10;
        this.raceStatusBackend = 'complete';
      }
    };
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