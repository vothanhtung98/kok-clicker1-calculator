import upgradeStrategy from './upgradeStrategy.js'
import { changeTimeFormatToMins } from './utilities.js'
import findStratsAvailable from './findStratsAvailable.js'
import findBestStrat from './findBestStrat.js'
import { totalPointPerLvl, intimacyLvl } from './constants.js'


// Complete strategy to finish the event
const completedStrat = ({ xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft, currentStamina, staminaPurchaseCount }) => {
    let originalStrategy, bestPurchaseStrat, strategyAfterPurchase

    originalStrategy = upgradeStrategy({ xp, currentIntimacy, currentAphros, currentStamina })
    let timeLeft = changeTimeFormatToMins({ d: dLeft, h: hLeft, m: mLeft })
    let upgradeTime = 0
    let totalTimeRequired
    let timeNeeded = 0

    // find total time required to finish the event when Intimacy lvl < 5
    if (originalStrategy.length > 0) {
        upgradeTime = originalStrategy.reduce((totalTime, intimacyLvl) => totalTime += intimacyLvl.timeToUpgrade, 0)
        let timeAtIntimacyLvl5 = (totalPointPerLvl[totalPointPerLvl.length - 1] - originalStrategy[originalStrategy.length - 1].xpAfterUprade) * intimacyLvl[5].staminaCost / intimacyLvl[5].clickPower
        totalTimeRequired = upgradeTime + timeAtIntimacyLvl5
    }
    // when Intimacy lvl = 5
    else {
        totalTimeRequired = (totalPointPerLvl[totalPointPerLvl.length - 1] - xp) * intimacyLvl[5].staminaCost / intimacyLvl[5].clickPower
    }

    if (totalTimeRequired < 10) totalTimeRequired = 10
    timeNeeded = totalTimeRequired - timeLeft
    if (timeNeeded <= 0) return { originalStrategy, bestPurchaseStrat, strategyAfterPurchase, freeTime: -timeNeeded }
    else {
        let stratsAvailable = findStratsAvailable({ currentIntimacy, currentAphros, timeNeeded, upgradeTime, staminaPurchaseCount })
        bestPurchaseStrat = findBestStrat({ stratsAvailable })
        currentAphros += bestPurchaseStrat.aphrosPurchaseTimes * 200
        strategyAfterPurchase = upgradeStrategy({ xp, currentIntimacy, currentAphros, currentStamina })
    }
    return { originalStrategy, bestPurchaseStrat, strategyAfterPurchase }
}

export default completedStrat
