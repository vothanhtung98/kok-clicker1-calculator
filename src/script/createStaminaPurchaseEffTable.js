// Create stamina only strategy from max purchase times
const createStaminaPurchaseEffTable = ({ maxPurchaseTimes, staminaPurchaseCount }) => {
    let staminaPurchaseCost = []
    let intialCost = staminaPurchaseCount % 3 ? (Math.floor(staminaPurchaseCount / 3) + 1) * 100 : (staminaPurchaseCount / 3 + 1) * 100
    if (staminaPurchaseCount % 3) {
        for (let i = 1; i <= (3 - staminaPurchaseCount % 3); i++) {
            staminaPurchaseCost.push(intialCost)
        }
    } else {
        staminaPurchaseCost.push(intialCost, intialCost, intialCost)
    }
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

export default createStaminaPurchaseEffTable