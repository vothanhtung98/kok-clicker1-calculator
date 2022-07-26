import calculatePerIntimacy from "./calculatePerIntimacy.js"

// Calculate strategy to uprade from current Intimacy lvl to Intimacy lvl 5
const upgradeStrategy = ({ xp, currentIntimacy, currentAphros, currentStamina }) => {
    let strategy = []
    let timeToUpgradeFromStart = 0, timeToStopFromStart = 0
    while (currentIntimacy < 5) {
        let result = calculatePerIntimacy({ xp, currentIntimacy, currentAphros, currentStamina })
        if (result) {
            timeToUpgradeFromStart += result.timeToUpgrade
            timeToStopFromStart = timeToUpgradeFromStart - result.timeSave
            result.timeToUpgradeFromStart = timeToUpgradeFromStart
            result.timeToStopFromStart = timeToStopFromStart
            strategy.push(result)
            xp = result.xpAfterUprade
            currentIntimacy = result.upgradeToIntimacyLvl
            currentAphros = 0
            currentStamina = 0
        } else return strategy
    }
    return strategy
}

export default upgradeStrategy