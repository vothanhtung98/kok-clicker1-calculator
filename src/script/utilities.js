import { totalPointPerLvl, aphrosPurchaseOptions, intimacyLvl } from './constants.js'

/** Change time format*/
export const changeTimeFormatFromMinute = ({ mins }) => {
    let d = Math.floor(mins / 1440)
    let h = Math.floor((mins - d * 1440) / 60)
    let m = mins - d * 1440 - h * 60
    if (d > 0) return `${d}d${h}h${m}m`
    else if (h > 0) return `${h}h${m}m`
    else return `${m}m`
}

export const changeTimeFormatToMins = ({ d = 0, h = 0, m = 0 }) => d * 1440 + h * 60 + m

/** Find your pleasure lvl with xp*/
export const findYourLvl = (xp) => [...totalPointPerLvl, xp].sort((a, b) => a - b).indexOf(xp)

/** Find timestamp of next amount of mins from now*/
export const findTimestamp = ({ mins }) => {
    const ms = mins * 60 * 1000
    const result = new Date(Date.now() + ms)

    const date = result.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })
    const time = result.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
}

/** Find purchase efficency at Intimacy lvl*/
export const purchaseEffAtIntimacyLvl = ({ intimacy }) => {
    return 1 - ((intimacyLvl[intimacy].clickPower / intimacyLvl[intimacy].staminaCost)
        / (intimacyLvl[5].clickPower / intimacyLvl[5].staminaCost))
}

/** Create aprhos options max time gain per intimacy lvl table*/
export const createAprhosOptionsMaxTimeGain = () => {
    let createAprhosOptionsMaxTimeGain = []
    for (let i = 1; i <= 5; i++) {
        const aphrosPurchaseIntimacy = {}
        aphrosPurchaseIntimacy['intimacyLvl'] = i
        aphrosPurchaseIntimacy['optionsMaxTimeGain'] = {}
        const eff = purchaseEffAtIntimacyLvl({ intimacy: i })
        for (let j = 1; j <= 3; j++) {
            aphrosPurchaseIntimacy['optionsMaxTimeGain'][j] = aphrosPurchaseOptions[j].aphros * 10 / 4 * eff
        }
        createAprhosOptionsMaxTimeGain.push(aphrosPurchaseIntimacy)
    }
    return createAprhosOptionsMaxTimeGain
}