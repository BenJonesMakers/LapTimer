const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/races.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the Races database.');
  }
});

var databaseActions = {
  async messageToObject(message, raceID) {

    const messageTabs = message.split('\t');
    let messageObj = {}
    if (messageTabs[0].substring(1, 3) === '@') {
      messageObj = {
        sor: messageTabs[0],
        command: messageTabs[0].substring(1, 3),
        decoderId: messageTabs[1],
        recordSeq: messageTabs[2],
        transponderId: messageTabs[3],
        timeSeconds: messageTabs[4]
      }

      writeMessageObjectToDB(messageObj, RaceID)

    } else if (messageTabs[0].substring(1, 3) === '#') {
      console.log('keepalive', messageTabs);
    }

    return messageObj;
  },

  createNewRace(raceDetails) {
    const { raceID, raceLength, startTime } = raceDetails;
    const params = {
      $raceID: raceID,
      $raceLength: raceLength,
      $startTime: startTime
    }
    const sql = 'INSERT INTO current_race(race_id, race_length, race_start_time) VALUES($raceID ,$raceLength, $startTime)';
    db.run(sql, params, ['C'], function (err) {
      if (err) {
        return console.log(err.message);
      } else {
        console.log('New Race Created in the DB');
      }
    })
  },

  insertRaceMessage(raceID, messageAsAString) {
    const messageParams = {
      $raceid: raceID || 'test',
      $message: messageAsAString
    }
    const sql = 'INSERT INTO session_messages(raceid, message) VALUES($raceid ,$message)';
    db.run(sql, messageParams, ['C'], function (err) {
      if (err) {
        return console.log(err.message);
      }
    });
  },

  updateRaceStartTime(raceID, raceStartTime) {
    const messageParams = {
      $raceid: raceID,
      $starttime: raceStartTime
    }

    const sql = 'UPDATE current_race SET first_race_message_time = $starttime WHERE(race_id = $raceid)';
    db.run(sql, messageParams, ['C'], function (err) {
      if (err) {
        return console.log('here', err.message);
      }
    });
  },

  getRaceStartFromDB(raceID) {
    let db = new sqlite3.Database('./db/races.db');
    let sql = `SELECT first_race_message_time FROM current_race WHERE race_id = '${raceID}'`;
    let raceStartTime;
    db.get(sql, [], (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      raceStartTime = row.first_race_message_time;
      return raceStartTime;
    });
  }
}

module.exports = databaseActions;