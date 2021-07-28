const sqlite3 = require('sqlite3').verbose();
const { resolve } = require('bluebird');
const Promise = require('bluebird');
let db = new sqlite3.Database('./db/races.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the Races database.');
    }
});

var Driver = {

    async Signup(transponderId, realName) {
        if (transponderId && realName) {
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
        } else {
            console.log('No Data Recieved');
        }
    },

    GetAll() {
        let sql = `SELECT * FROM drivers`;

        return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

}
module.exports = Driver;