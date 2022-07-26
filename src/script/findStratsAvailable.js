import createStaminaPurchaseEffTable from "./createStaminaPurchaseEffTable.js"
import createAphrosPurchaseEffTable from "./createAphrosPurchaseEffTable.js"

// Find available strategies if your time needed to finish < event's time left
const findStratsAvailable = ({ currentIntimacy, currentAphros, timeNeeded, upgradeTime, staminaPurchaseCount }) => {
    let stratsAvailable = {}
    let maxStaminaPurchases = timeNeeded % 100 ? Math.floor(timeNeeded / 100) + 1 : timeNeeded / 100
    let staminaEffTable = createStaminaPurchaseEffTable({ maxPurchaseTimes: maxStaminaPurchases, staminaPurchaseCount })
    stratsAvailable.timeNeeded = timeNeeded
    stratsAvailable.stamina = staminaEffTable
    stratsAvailable.aphros = []
    let maxCost, aphrosEffTable
    if (upgradeTime) {
        maxCost = staminaEffTable[staminaEffTable.length - 1].totalCost
        aphrosEffTable = createAphrosPurchaseEffTable({ currentIntimacy, currentAphros, maxCost }).filter(purchaseNumOf => purchaseNumOf.timeGain < timeNeeded)
        stratsAvailable.aphros = aphrosEffTable
    }
    return stratsAvailable
}

export default findStratsAvailable