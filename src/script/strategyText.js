import completedStrat from "./completedStrat.js"
import { findTimestamp, changeTimeFormatFromMinute } from './utilities.js'

// Convert strategy to text
const strategyText = ({ xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft, currentStamina, staminaPurchaseCount }) => {
    let { originalStrategy, bestPurchaseStrat, strategyAfterPurchase, freeTime } = completedStrat({ xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft, currentStamina, staminaPurchaseCount })
    let strategyText = ``
    let makeTextFrom = bestPurchaseStrat ? strategyAfterPurchase : originalStrategy
    // Case need to purchase
    if (bestPurchaseStrat) {
        let i = 0
        if (bestPurchaseStrat.aphrosPurchaseTimes) {
            strategyText += `Step 1: Buy ${bestPurchaseStrat.aphrosPurchaseTimes * 200} Aphrosidiacs.\n`
            i++
        }
        makeTextFrom.forEach((intimacyLvl, index) => strategyText += `Step ${index + 1 + i}: Stop using stamina at ${findTimestamp({ mins: intimacyLvl.timeToStopFromStart })}, save stamina till ${findTimestamp({ mins: intimacyLvl.timeToUpgradeFromStart })} then upgrade to Intimacy lvl ${intimacyLvl.upgradeToIntimacyLvl} and use all stamina. \n`)
        if (bestPurchaseStrat.staminaPurchaseTimes) {
            let timeOrTimes = bestPurchaseStrat.staminaPurchaseTimes === 1 ? 'time' : 'times'
            strategyText += `Step ${makeTextFrom.length + i + 1}: Buy Stamina ${bestPurchaseStrat.staminaPurchaseTimes} ${timeOrTimes}.\n`
        }
        strategyText += `You have ${changeTimeFormatFromMinute({ mins: bestPurchaseStrat.freeTime })} of leeway. Total gems required: ${bestPurchaseStrat.totalCost}.`
    } else {
        // Case don't need purchase
        makeTextFrom.forEach((intimacyLvl, index) => strategyText += `Step ${index + 1}: Stop using stamina at ${findTimestamp({ mins: intimacyLvl.timeToStopFromStart })}, save stamina till ${findTimestamp(intimacyLvl.timeToUpgradeFromStart)} then upgrade to Intimacy lvl ${intimacyLvl.upgradeToIntimacyLvl} and use all stamina. \n`)
        strategyText += `You have ${changeTimeFormatFromMinute({ mins: freeTime })} of leeway.Total gems required: 0.`
    }
    return strategyText
}

export default strategyText