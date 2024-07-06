const { levelArray } = require ('../functions/levelArray.js');

module.exports = (level) => {
    return levelArray[level] // Using until a nice function is found
}