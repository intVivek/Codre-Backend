/**
 * Function to generate a random UUID and extract a substring to create a random ID.
 * @param {number} start - The starting index for the substring (default: 10).
 * @param {number} end - The ending index for the substring (default: 22).
 * @returns {string} - A random ID extracted from a UUID.
 */
const generateRandomId = (start = 10, end = 22) => uuid().slice(start, end).toUpperCase();

// Export the generateRandomId function
module.exports = generateRandomId;
