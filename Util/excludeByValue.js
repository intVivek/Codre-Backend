/**
 * Function to exclude elements with a specific value from an array.
 * @param {Array} array - The input array.
 * @param {*} value - The value to exclude.
 * @returns {Array} - The modified array with the specified value excluded.
 */
const excludeByValue = (array, value) => array.filter((element) => element !== value);

// Export the excludeByValue function
module.exports = excludeByValue;
