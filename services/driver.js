const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
let db = new sqlite3.Database('./db/races.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the Races database.');
    }
});

var Driver = {

    async Signup(user) {

        // const driverRecord = await DriverModel.create(user);
        // return driverRecord;

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