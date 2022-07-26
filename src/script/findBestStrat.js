// Find best strategy from available strategies
const findBestStrat = ({ stratsAvailable }) => {
    let mixStrat = []
    let staminaOnlyStrat = stratsAvailable.stamina[stratsAvailable.stamina.length - 1]
    mixStrat.push({
        staminaPurchaseTimes: staminaOnlyStrat.purchaseTimes,
        aphrosPurchaseTimes: 0,
        totalCost: staminaOnlyStrat.totalCost,
        timeGain: staminaOnlyStrat.timeGain,
        eff: staminaOnlyStrat.eff,
        freeTime: staminaOnlyStrat.timeGain - stratsAvailable.timeNeeded
    })
    // return stamina only strat if there is no aphros strats available
    if (stratsAvailable.aphros.length === 0) return mixStrat[0]
    // Find mix Stamina and Aphros strats
    else {
        for (let i = 0; i < stratsAvailable.aphros.length; i++) {
            let staminaTimeGain = stratsAvailable.timeNeeded - stratsAvailable.aphros[i].timeGain
            let staminaPairStrat = stratsAvailable.stamina.find(purchaseNumOf => purchaseNumOf.timeGain > staminaTimeGain)
            let totalCost = staminaPairStrat.totalCost + stratsAvailable.aphros[i].totalCost
            let timeGain = staminaPairStrat.timeGain + stratsAvailable.aphros[i].timeGain
            let eff = timeGain / totalCost
            mixStrat.push({
                staminaPurchaseTimes: staminaPairStrat.purchaseTimes,
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

export default findBestStrat