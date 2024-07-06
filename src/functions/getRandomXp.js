/**
 * 
 * @param {*} minimum The Miniumum amount of xp to be generated randomly
 * @param {*} maximum The Maximum amount of xp to be generated randomly
 * @returns A random number between the minimum and maximum values
 */

function getRandomXp(minimum, maximum) {
    minimum = Math.ceil(minimum);
    maximum = Math.floor(maximum);
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

/**
 * 
 * @param {*} level The current level of the user
 * @returns A random number of xp to be generated based on the level of the user
 */

function randomizeXp(level) {
    const lowerFence = ((level ** 2) + 50) * 1.9
    const upperFence = ((level ** 2) + 65) * 2.1

    if(level === 0) {
        return getRandomXp(20, 30)
    } else {
        return getRandomXp(lowerFence, upperFence)
    }
}

module.exports = {
    getRandomXp,
    randomizeXp
}