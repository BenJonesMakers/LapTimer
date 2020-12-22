var Timing = {
    messageToObject: function (message) {

        const messageTabs = message.split('\t');
        let messageObj = {}
        if (messageTabs[0].substring(1,3) === '@') {
            messageObj = {
                sor: messageTabs[0],
                command: messageTabs[0].substring(1,3),
                decoderId: messageTabs[1],
                recordSeq: messageTabs[2],
                transponderId: messageTabs[3],
                timeSeconds: messageTabs[4]
            }
            console.log(messageObj);
        } else if (messageTabs[0].substring(1,3) === '#') {
            console.log('keepalive', messageTabs);
        }
        return messageObj;
    }
}

module.exports =  Timing;