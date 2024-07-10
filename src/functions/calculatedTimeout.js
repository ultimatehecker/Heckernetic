
/**
 * 
 * @param {*} level The current level of the user
 * @returns The number of milliseconds the the timeout decreses per level
 */

function calculateTimeout(level) {
    if(level === 0) {
        return 60000
    } else {
        60000 - (level.level * 1000)
    }
}

module.exports = { calculateTimeout }