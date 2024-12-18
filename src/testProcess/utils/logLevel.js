const logger = require('../logger')


exports.logInfo = (msg) => {
    console.log(msg)
    logger.info(msg)
}

exports.logError = (msg) => {
    console.error(msg)
    logger.error(msg)
}