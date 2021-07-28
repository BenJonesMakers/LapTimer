const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

let db = new sqlite3.Database('./db/races.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the Races database.');
  }
});

var databaseActions = {

  getAllDrivers() {
    let sql = `SELECT * FROM drivers`;

    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err)
        } else {
          return resolve(rows)
        }
      })
    })
  },
  saveNewDriver(transponderId, realName) {
    const messageParams = {
      $transponderId: transponderId,
      $realName: realName
    }

    let sql = 'INSERT INTO drivers(transponderId, realName) VALUES($transponderId ,$realName)';

    return new Promise((resolve, reject) => {
      db.run(sql, messageParams, (err, res) => {
        if (err) {
          console.error(err.message);
          reject(err)
        } else {
          return resolve(res);
        }
      })
    })

  },

  createNewRace(raceDetails) {
    const {
      raceID,
      raceLength,
      startTime,
      racers,
      uniqueTransponders,
      fastestLap,
      fastestLapTransponder
    } = raceDetails;
    const params = {
      $raceID: raceID,
      $raceLength: raceLength,
      $startTime: startTime,
      $racers: JSON.stringify(racers),
      $uniqueTransponders: uniqueTransponders.toString(),
      $fastestLap: fastestLap,
      $fastestLapTransponder: fastestLapTransponder
    }
    const sql = 'INSERT INTO saved_races(race_id, race_length, race_start_time,racers, uniqueTransponders,fastestLap, fastestLapTransponder) '
    const sqlValues = 'VALUES($raceID, $raceLength, $startTime, $racers, $uniqueTransponders, $fastestLap, $fastestLapTransponder)';
    db.run(sql + sqlValues, params, ['C'], function (err) {
      if (err) {
        return console.log(err.message);
      } else {
        console.log('New Race Created in the DB');
      }
    })
  },

}

module.exports = databaseActions;