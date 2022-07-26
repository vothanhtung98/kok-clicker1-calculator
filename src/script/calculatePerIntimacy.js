import { intimacyLvl, eventLvl } from './constants.js'
import { findYourLvl } from './utilities.js'

// Calculate strategy to upgrade to next Intimacy lvl
const calculatePerIntimacy = ({ xp, currentIntimacy, currentAphros, currentStamina = 0 }) => {
    // Skip to next intimacy lvl if current aphros >= aphros needed to next lvl, return if at intimacy lvl 5 already
    while (currentAphros >= intimacyLvl[currentIntimacy].aphrosToUpgrade) {
        currentAphros = currentAphros - intimacyLvl[currentIntimacy].aphrosToUpgrade
        currentIntimacy += 1
        if (currentIntimacy === 5) return
    }

    // Calculate best strategy to upgrade to next intimacy lvl
    let timeToUpgrade, pointEarnNoSave, xpNoSave, lvlNoSave, timeSave, actualPointEarn, actualXp, actualLvl, actualTimeSave, xpAfterUprade
    timeToUpgrade = (intimacyLvl[currentIntimacy].aphrosToUpgrade - currentAphros) * 10 / 4;
    pointEarnNoSave = (timeToUpgrade + currentStamina) / intimacyLvl[currentIntimacy].staminaCost * intimacyLvl[currentIntimacy].clickPower
    xpNoSave = xp + pointEarnNoSave;
    lvlNoSave = findYourLvl(xpNoSave)
    timeSave = eventLvl[lvlNoSave].staminaCap

    // Return strategy if timeSave >= timeToUpgrade
    if (timeSave >= timeToUpgrade + currentStamina) return {
        upgradeToIntimacyLvl: currentIntimacy + 1,
        timeToStop: 0,
        timeToUpgrade,
        timeSave: timeToUpgrade + currentStamina,
        xpAfterUprade: xp + (timeToUpgrade + currentStamina) / intimacyLvl[currentIntimacy + 1].staminaCost * intimacyLvl[currentIntimacy + 1].clickPower
    }

    // Calculate strategy if timeSave < timeToUpgrade + currentStamina
    actualPointEarn = (timeToUpgrade + currentStamina - timeSave) / intimacyLvl[currentIntimacy].staminaCost * intimacyLvl[currentIntimacy].clickPower
    actualXp = xp + actualPointEarn
    actualLvl = findYourLvl(actualXp)
    actualTimeSave = eventLvl[actualLvl].staminaCap
    xpAfterUprade = actualXp + actualTimeSave / intimacyLvl[currentIntimacy + 1].staminaCost * intimacyLvl[currentIntimacy + 1].clickPower
    return {
        upgradeToIntimacyLvl: currentIntimacy + 1,
        timeToStop: timeToUpgrade - actualTimeSave,
        timeToUpgrade,
        timeSave: actualTimeSave,
        xpAfterUprade
    }
}

export default calculatePerIntimacy