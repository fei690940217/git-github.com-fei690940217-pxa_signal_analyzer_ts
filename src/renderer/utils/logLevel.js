import loglevel from 'loglevel';
import { addLogRendererToMain } from './index'
const REACT_APP_LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL;
console.log(`REACT_APP_LOG_LEVEL: ${REACT_APP_LOG_LEVEL}`)
loglevel.setLevel(REACT_APP_LOG_LEVEL)

export const logInfo = (msg) => {
    loglevel.info(msg)
    addLogRendererToMain({ level: 'info', msg })
}

export const logError = (msg) => {
    loglevel.error(msg)
    addLogRendererToMain({ level: 'error', msg })
}