import { createAprhosOptionsMaxTimeGain } from './utilities.js'

/** Stamina cap and Xp total per pleasure lvl*/
export const eventLvl = {
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

/** Intimacy info*/
export const intimacyLvl = {
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

/**Aphros purchase options */
export const aphrosPurchaseOptions = {
    1: {
        cost: 1000,
        aphros: 200
    },
    2: {
        cost: 300,
        aphros: 40
    },
    3: {
        cost: 100,
        aphros: 10
    }
}

// Total Xp per lvl, use to find you pleasure lvl
export const totalPointPerLvl = [0, 400, 2400, 5400, 9400, 16400, 26400, 39400, 53900, 71400, 91400, 128000, 186000, 284000, 464000, 814000]

/** Aprhos options max time gain per intimacy lvl table*/
export const aprhosOptionsMaxTimeGain = createAprhosOptionsMaxTimeGain()