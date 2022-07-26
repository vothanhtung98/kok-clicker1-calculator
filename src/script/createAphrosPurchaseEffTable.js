import { intimacyLvl } from './constants.js'

// Create aphrosidiac only strategy from max purchase times
const createAphrosPurchaseEffTable = ({ currentIntimacy, currentAphros, maxCost }) => {
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

    // Case maxPurchases time = number of purchases to next Intimacy lvl that <5
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
        let aphrosLeftOnNextLvl = purchaseTimes * 200 - aphrosToNextLvlTable[aphrosToNextLvlTable.length - 1]
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

export default createAphrosPurchaseEffTable