/**
 * Function to get a random element from an array.
 * @param {Array} arr - The input array from which a random element is selected.
 * @throws {Error} - Throws an error if the input is not a valid non-empty array.
 * @returns {*} - A randomly selected element from the input array.
 */
const getRandomElement = (arr) => {
  // Check if the input is a valid non-empty array
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Invalid or empty array");
  }

  // Generate a random index within the array's length
  const randomIndex = Math.floor(Math.random() * arr.length);

  // Return the element at the randomly selected index
  return arr[randomIndex];
};

// Export the getRandomElement function
module.exports = getRandomElement;
