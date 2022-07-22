// Stamina cap and Xp total per pleasure lvl
const eventLvl = {
    1: {
        staminaCap: 120,
        totalPoints: 0
    },
    2: {
        staminaCap: 130,
        totalPoints: 400
    },
    3: {
        staminaCap: 140,
        totalPoints: 2400
    },
    4: {
        staminaCap: 150,
        totalPoints: 5400
    },
    5: {
        staminaCap: 160,
        totalPoints: 9400
    },
    6: {
        staminaCap: 170,
        totalPoints: 16400
    },
    7: {
        staminaCap: 180,
        totalPoints: 26400
    },
    8: {
        staminaCap: 190,
        totalPoints: 39400
    },
    9: {
        staminaCap: 195,
        totalPoints: 53900
    },
    10: {
        staminaCap: 200,
        totalPoints: 71400
    },
    11: {
        staminaCap: 210,
        totalPoints: 91400
    },
    12: {
        staminaCap: 220,
        totalPoints: 128000
    },
    13: {
        staminaCap: 230,
        totalPoints: 186000
    },
    14: {
        staminaCap: 240,
        totalPoints: 284000
    },
    15: {
        staminaCap: 240,
        totalPoints: 464000
    },
    16: {
        staminaCap: 240,
        totalPoints: 814000
    }
}

// Intimacy info
const intimacyLvl = {
    1: {
        clickPower: 5,
        staminaCost: 1,
        aphrosToUpgrade: 400
    },
    2: {
        clickPower: 20,
        staminaCost: 2,
        aphrosToUpgrade: 1200
    },
    3: {
        clickPower: 60,
        staminaCost: 3,
        aphrosToUpgrade: 1800
    },
    4: {
        clickPower: 240,
        staminaCost: 6,
        aphrosToUpgrade: 2400
    },
    5: {
        clickPower: 1000,
        staminaCost: 10,
        aphrosToUpgrade: 0
    }
}

// Total Xp per lvl, use to find you pleasure lvl
const totalPointPerLvl = [0, 400, 2400, 5400, 9400, 16400, 26400, 39400, 53900, 71400, 91400, 128000, 186000, 284000, 464000, 814000]

// Find your pleasure lvl with xp
const findYourLvl = (xp) => [...totalPointPerLvl, xp].sort((a, b) => a - b).indexOf(xp)

// Change time format
const changeTimeFormatFromMinute = (mins) => {
    let d = Math.floor(mins / 1440)
    let h = Math.floor((mins - d * 1440) / 60)
    let m = mins - d * 1440 - h * 60
    if (d > 0) return `${d}d${h}h${m}m`
    else if (h > 0) return `${h}h${m}m`
    else return `${m}m`
}

const changeTimeFormatToMins = (d = 0, h = 0, m = 0) => d * 1440 + h * 60 + m

// Calculate strategy to upgrade to next Intimacy lvl
const calculatePerIntimacy = (xp, currentIntimacy, currentAphros) => {
    // Skip to next intimacy lvl if current aphros >= aphros needed to next lvl, return if at intimacy lvl 5 already
    while (currentAphros >= intimacyLvl[currentIntimacy].aphrosToUpgrade) {
        currentAphros = currentAphros - intimacyLvl[currentIntimacy].aphrosToUpgrade
        currentIntimacy += 1
        if (currentIntimacy === 5) return
    }

    // Calculate best strategy to upgrade to next intimacy lvl
    let timeToUpgrade, pointEarnNoSave, xpNoSave, lvlNoSave, timeSave, actualPointEarn, actualXp, actualLvl, actualTimeSave, xpAfterUprade
    timeToUpgrade = (intimacyLvl[currentIntimacy].aphrosToUpgrade - currentAphros) * 10 / 4;
    pointEarnNoSave = timeToUpgrade / intimacyLvl[currentIntimacy].staminaCost * intimacyLvl[currentIntimacy].clickPower
    xpNoSave = xp + pointEarnNoSave;
    lvlNoSave = findYourLvl(xpNoSave)
    timeSave = eventLvl[lvlNoSave].staminaCap

    // Return strategy if timeSave >= timeToUpgrade
    if (timeSave > timeToUpgrade) return {
        upgradeToIntimacyLvl: currentIntimacy + 1,
        timeToStop: 0,
        timeToUpgrade,
        timeSave: timeToUpgrade,
        xpAfterUprade: xp + timeSave / intimacyLvl[currentIntimacy + 1].staminaCost * intimacyLvl[currentIntimacy + 1].clickPower
    }

    // Calculate strategy if timeSave < timeToUpgrade
    actualPointEarn = (timeToUpgrade - timeSave) / intimacyLvl[currentIntimacy].staminaCost * intimacyLvl[currentIntimacy].clickPower
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

// Calculate strategy to uprade from current Intimacy lvl to Intimacy lvl 5
const upgradeStrategy = (xp, currentIntimacy, currentAphros) => {
    let strategy = []
    while (currentIntimacy < 5) {
        let result = calculatePerIntimacy(xp, currentIntimacy, currentAphros)
        if (result) {
            strategy.push(result)
            xp = result.xpAfterUprade
            currentIntimacy = result.upgradeToIntimacyLvl
            currentAphros = 0
        } else return strategy
    }
    return strategy
}

// Create stamina only strategy from max purchase times
const createStaminaPurchaseEffTable = (maxPurchaseTimes) => {
    let staminaPurchaseCost = [100, 100, 100]
    while (staminaPurchaseCost.length < maxPurchaseTimes)
        staminaPurchaseCost.push(
            staminaPurchaseCost[staminaPurchaseCost.length - 1] + 100,
            staminaPurchaseCost[staminaPurchaseCost.length - 1] + 100,
            staminaPurchaseCost[staminaPurchaseCost.length - 1] + 100
        )
    staminaPurchaseCost = staminaPurchaseCost.slice(0, maxPurchaseTimes)
    let totalCost = 0
    const staminaPurchaseEffTable = staminaPurchaseCost.map((cost, index) => {
        let purchaseTimes = index + 1
        totalCost += cost
        return {
            purchaseTimes,
            totalCost,
            timeGain: purchaseTimes * 100,
            eff: purchaseTimes * 100 / totalCost
        }
    })
    return staminaPurchaseEffTable
}

// Create aphrosidiac only strategy from max purchase times
const createAphrosPurchaseEffTable = (currentIntimacy, currentAphros, maxCost) => {
    // Skip to your current Intimacy Lvl possible, quit function if you're at lvl 5 already
    while (currentAphros >= intimacyLvl[currentIntimacy].aphrosToUpgrade) {
        currentAphros = currentAphros - intimacyLvl[currentIntimacy].aphrosToUpgrade
        currentIntimacy += 1
        if (currentIntimacy === 5) return
    }

    let aphrosPurchaseEffTable = []
    // Find max purchases you can do with maxCost
    let maxPurchaseTimes = maxCost % 1000 ? Math.floor(maxCost / 1000) + 1 : Math.floor(maxCost / 1000)

    // Create Array contains Aphrosidiacs needed to next(s) lvl
    let aphrosToNextLvl = intimacyLvl[currentIntimacy].aphrosToUpgrade - currentAphros
    let aphrosToNextLvlTable = [aphrosToNextLvl]
    let aphrosAcumulate = aphrosToNextLvl
    for (let i = currentIntimacy + 1; i < 5; i++) {
        aphrosAcumulate += intimacyLvl[i].aphrosToUpgrade
        aphrosToNextLvlTable.push(aphrosAcumulate)
    }

    // Create Array contains number of purchases needed to next(s) lvl
    let purchaseToNextLvl = aphrosToNextLvl % 200 ? Math.floor(aphrosToNextLvl / 200) + 1 : aphrosToNextLvl / 200
    let pucharseToNextLvlTable = [purchaseToNextLvl]
    let purchaseAcumulate = purchaseToNextLvl
    for (let i = currentIntimacy + 1; i < 5; i++) {
        purchaseAcumulate += intimacyLvl[i].aphrosToUpgrade / 200
        pucharseToNextLvlTable.push(purchaseAcumulate)
    }

    // Change maxPurchaseTimes to max purchases times in the purchase table if it's greater
    if (maxPurchaseTimes > pucharseToNextLvlTable[pucharseToNextLvlTable.length - 1]) maxPurchaseTimes = pucharseToNextLvlTable[pucharseToNextLvlTable.length - 1]
    let indexOfMaxPurchaseTimes = [...pucharseToNextLvlTable, maxPurchaseTimes].sort((a, b) => a - b).indexOf(maxPurchaseTimes)

    // Create Aphros purchase efficency table
    let purchaseTimes = 0
    let totalCost = 0
    let timeGain = 0

    // Calculate intimacy purchase efficency
    for (let i = 0; i <= indexOfMaxPurchaseTimes; i++) {
        let iterateTimes
        if (i === indexOfMaxPurchaseTimes) { iterateTimes = i ? maxPurchaseTimes - pucharseToNextLvlTable[indexOfMaxPurchaseTimes - 1] : maxPurchaseTimes }
        else if (i > 0) iterateTimes = pucharseToNextLvlTable[i] - pucharseToNextLvlTable[i - 1]
        else iterateTimes = pucharseToNextLvlTable[i]
        for (let j = 1; j <= iterateTimes; j++) {
            purchaseTimes += 1
            totalCost += 1000
            timeGain += 500 * (1 - ((intimacyLvl[currentIntimacy + i].clickPower / intimacyLvl[currentIntimacy + i].staminaCost)
                / (intimacyLvl[5].clickPower / intimacyLvl[5].staminaCost)))
            let eff = timeGain / totalCost
            let intimacyAfterPurchase = (j === iterateTimes && i !== indexOfMaxPurchaseTimes) ? currentIntimacy + i + 1 : currentIntimacy + i
            aphrosPurchaseEffTable.push({
                purchaseTimes,
                totalCost,
                timeGain,
                eff,
                intimacyAfterPurchase
            })
        }

        // Calculate exact time gain if aphros needed to next lvl < 200
        if (i !== indexOfMaxPurchaseTimes && aphrosToNextLvlTable[i] % 200) {
            let aphrosLeftToNextLvl = purchaseTimes * 200 - aphrosToNextLvlTable[i]
            let aphrosLeftOnNextLvl = 200 - aphrosLeftToNextLvl
            let timeLost =
                aphrosLeftOnNextLvl * 500 / 200
                * ((intimacyLvl[currentIntimacy + i + 1].clickPower / intimacyLvl[currentIntimacy + i + 1].staminaCost
                    - intimacyLvl[currentIntimacy + i].clickPower / intimacyLvl[currentIntimacy + i].staminaCost)
                    / (intimacyLvl[5].clickPower / intimacyLvl[5].staminaCost))
            timeGain -= timeLost
            let eff = timeGain / totalCost
            aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].timeGain = timeGain
            aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].eff = eff
        }
    }

    // Case maxPurchases time = number of purchases to next Intimacy lvl
    if (
        pucharseToNextLvlTable.includes(maxPurchaseTimes)
        && maxPurchaseTimes !== pucharseToNextLvlTable[pucharseToNextLvlTable.length - 1]
    ) {
        let aphrosLeftToNextLvl = purchaseTimes * 200 - aphrosToNextLvlTable[indexOfMaxPurchaseTimes]
        let aphrosLeftOnNextLvl = 200 - aphrosLeftToNextLvl
        let timeLost =
            aphrosLeftOnNextLvl * 500 / 200
            * ((intimacyLvl[currentIntimacy + indexOfMaxPurchaseTimes + 1].clickPower / intimacyLvl[currentIntimacy + indexOfMaxPurchaseTimes + 1].staminaCost
                - intimacyLvl[currentIntimacy + indexOfMaxPurchaseTimes].clickPower / intimacyLvl[currentIntimacy + indexOfMaxPurchaseTimes].staminaCost)
                / (intimacyLvl[5].clickPower / intimacyLvl[5].staminaCost))
        timeGain -= timeLost
        let eff = timeGain / totalCost
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].timeGain = timeGain
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].eff = eff
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].intimacyAfterPurchase
            = currentIntimacy + indexOfMaxPurchaseTimes + 1
    }

    // Case max purchase times = number of purchases to Intimacy lvl 5
    if (
        pucharseToNextLvlTable.includes(maxPurchaseTimes)
        && maxPurchaseTimes === pucharseToNextLvlTable[pucharseToNextLvlTable.length - 1]
    ) {
        let aphrosLeftToNextLvl = purchaseTimes * 200 - aphrosToNextLvlTable[aphrosToNextLvlTable.length - 1]
        let aphrosLeftOnNextLvl = 200 - aphrosLeftToNextLvl
        let timeLost =
            aphrosLeftOnNextLvl * 500 / 200
            * (1 - ((intimacyLvl[4].clickPower / intimacyLvl[4].staminaCost)
                / (intimacyLvl[5].clickPower / intimacyLvl[5].staminaCost)))
        timeGain -= timeLost
        let eff = timeGain / totalCost
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].timeGain = timeGain
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].eff = eff
        aphrosPurchaseEffTable[aphrosPurchaseEffTable.length - 1].intimacyAfterPurchase
            = currentIntimacy + indexOfMaxPurchaseTimes + 1
    }
    return aphrosPurchaseEffTable
}

// Find available strategies if your time needed to finish < event's time left
const findStratsAvailable = (currentIntimacy, currentAphros, timeNeeded, upgradeTime) => {
    let stratsAvailable = {}
    let maxStaminaPurchases = timeNeeded % 100 ? Math.floor(timeNeeded / 100) + 1 : timeNeeded / 100
    let staminaEffTable = createStaminaPurchaseEffTable(maxStaminaPurchases)
    stratsAvailable.timeNeeded = timeNeeded
    stratsAvailable.stamina = staminaEffTable
    stratsAvailable.aphros = []
    let maxCost, aphrosEffTable
    if (upgradeTime) {
        maxCost = staminaEffTable[staminaEffTable.length - 1].totalCost
        aphrosEffTable = createAphrosPurchaseEffTable(currentIntimacy, currentAphros, maxCost).filter(purchaseNumOf => purchaseNumOf.timeGain < timeNeeded)
        stratsAvailable.aphros = aphrosEffTable
    }
    return stratsAvailable
}

// Find best strategy from available strategies
const findBestStrat = (stratsAvailable) => {
    let mixStrat = []
    // return stamina only strat if there is no aphros strats available
    if (stratsAvailable.aphros.length === 0) {
        let staminaOnlyStrat = stratsAvailable.stamina.pop()
        return {
            staminaPurchaeTimes: staminaOnlyStrat.purchaseTimes,
            aphrosPurchaseTimes: 0,
            totalCost: staminaOnlyStrat.totalCost,
            timeGain: staminaOnlyStrat.timeGain,
            eff: staminaOnlyStrat.eff,
            freeTime: staminaOnlyStrat.timeGain - stratsAvailable.timeNeeded
        }
    }
    // Find mix Stamina and Aphros strats
    else {
        for (let i = 0; i < stratsAvailable.aphros.length; i++) {
            let staminaTimeGain = stratsAvailable.timeNeeded - stratsAvailable.aphros[i].timeGain
            let staminaPairStrat = stratsAvailable.stamina.find(purchaseNumOf => purchaseNumOf.timeGain > staminaTimeGain)
            let totalCost = staminaPairStrat.totalCost + stratsAvailable.aphros[i].totalCost
            let timeGain = staminaPairStrat.timeGain + stratsAvailable.aphros[i].timeGain
            let eff = timeGain / totalCost
            mixStrat.push({
                staminaPurchaeTimes: staminaPairStrat.purchaseTimes,
                aphrosPurchaseTimes: stratsAvailable.aphros[i].purchaseTimes,
                totalCost,
                timeGain,
                eff
            })
        }
    }
    // find best mix strat
    mixStrat.sort((a, b) => a.totalCost - b.totalCost)
    let mixStratFiltered = mixStrat.filter(strat => strat.totalCost === mixStrat[0].totalCost)
    if (mixStratFiltered.length > 1) mixStratFiltered.sort((a, b) => a.eff - b.eff)
    mixStratFiltered[0].freeTime = mixStratFiltered[0].timeGain - stratsAvailable.timeNeeded
    return mixStratFiltered[0]
}

// Complete strategy to finish the event
const completedStrat = (xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft) => {
    let originalStrategy, bestPurchaseStrat, strategyAfterPurchase

    originalStrategy = upgradeStrategy(xp, currentIntimacy, currentAphros)
    let timeLeft = changeTimeFormatToMins(dLeft, hLeft, mLeft)
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
        totalTimeRequired = totalPointPerLvl[totalPointPerLvl.length - 1] * intimacyLvl[5].staminaCost / intimacyLvl[5].clickPower
    }

    timeNeeded = totalTimeRequired - timeLeft
    if (timeNeeded <= 0) return { originalStrategy, bestPurchaseStrat, strategyAfterPurchase, freeTime: -timeNeeded }
    else {
        let stratsAvailable = findStratsAvailable(currentIntimacy, currentAphros, timeNeeded, upgradeTime)
        bestPurchaseStrat = findBestStrat(stratsAvailable)
        currentAphros += bestPurchaseStrat.aphrosPurchaseTimes * 200
        strategyAfterPurchase = upgradeStrategy(xp, currentIntimacy, currentAphros)
    }
    return { originalStrategy, bestPurchaseStrat, strategyAfterPurchase }
}

// Convert strategy to text
const strategyText = (xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft) => {
    let { originalStrategy, bestPurchaseStrat, strategyAfterPurchase, freeTime } = completedStrat(xp, currentIntimacy, currentAphros, dLeft, hLeft, mLeft)
    let strategyText = ``
    let makeTextFrom = bestPurchaseStrat ? strategyAfterPurchase : originalStrategy
    // Case need to purchase
    if (bestPurchaseStrat) {
        let i = 0
        if (bestPurchaseStrat.aphrosPurchaseTimes) {
            strategyText += `Step 1: Buy ${bestPurchaseStrat.aphrosPurchaseTimes * 200} Aphrosidiacs.\n`
            i++
        }
        makeTextFrom.forEach((intimacyLvl, index) => strategyText += `Step ${index + 1 + i}: Stop using stamina after ${changeTimeFormatFromMinute(intimacyLvl.timeToStop)}, save stamina for ${changeTimeFormatFromMinute(intimacyLvl.timeSave)} then upgrade to Intimacy lvl ${intimacyLvl.upgradeToIntimacyLvl} and use all stamina. \n`)
        if (bestPurchaseStrat.staminaPurchaeTimes) {
            strategyText += `Step ${makeTextFrom.length + i + 1}: Buy Stamina ${bestPurchaseStrat.staminaPurchaeTimes} times.\n`
        }
        strategyText += `You have ${changeTimeFormatFromMinute(bestPurchaseStrat.freeTime)} of leeway. Total gems required: ${bestPurchaseStrat.totalCost}.`
    } else {
        // Case don't need purchase
        makeTextFrom.forEach((intimacyLvl, index) => strategyText += `Step ${index + 1}: Stop using stamina after ${changeTimeFormatFromMinute(intimacyLvl.timeToStop)}, save stamina for ${changeTimeFormatFromMinute(intimacyLvl.timeSave)} then upgrade to Intimacy lvl ${intimacyLvl.upgradeToIntimacyLvl} and use all stamina. \n`)
        strategyText += `You have ${changeTimeFormatFromMinute(freeTime)} of leeway.Total gems required: 0.`
    }
    return strategyText
}

const Script = {
    changeTimeFormatFromMinute,
    changeTimeFormatToMins,
    calculatePerIntimacy,
    upgradeStrategy,
    createStaminaPurchaseEffTable,
    createAphrosPurchaseEffTable,
    findStratsAvailable,
    findBestStrat,
    completedStrat,
    strategyText
}

export default Script