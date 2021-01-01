const localRaceStorage = require('node-persist');

async function storeTestData () {
    
    await localRaceStorage.init();


    let starttime = new Date();
    const clubCar = [1056.345, 1065.332, 1074.344, 1083.159, 1092.612, 1102.622, 1111.408];
    const benCar = [1056.345, 1065.567, 1075.489, 1081.965, 1091.232, 1105.254, 1110.485];

    for (let i = 0; i < clubCar.length; i++) {
        const element = clubCar[i];
        let messageObj = {
            sor: 0x01,
            command: '#',
            decoderId: '202',
            recordSeq: '0',
            transponderId: '1003456',
            timeSeconds: element
        }

        console.log(messageObj);

        let tempArray = await localRaceStorage.getItem('raceMessages');
        tempArray.push(messageObj);
        await localRaceStorage.setItem('raceMessages', tempArray);

    }

    for (let i = 0; i < benCar.length; i++) {
        const element = benCar[i];
        let messageObj = {
            sor: 0x01,
            command: '#',
            decoderId: '202',
            recordSeq: '0',
            transponderId: '1003666',
            timeSeconds: element
        }

        console.log(messageObj);

        let tempArray = await localRaceStorage.getItem('raceMessages');
        tempArray.push(messageObj);
        await localRaceStorage.setItem('raceMessages', tempArray);

    }
        
}

module.exports.storeTestData = storeTestData;