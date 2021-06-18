const moment = require('moment');

const formatMessage = (username, text, time) => {
    t = time ? time : moment().format('h:mm a')

    return {
        username,
        text,
        time: t
    }
}

module.exports = formatMessage;