const getRandomElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Invalid or empty array");
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

module.exports = getRandomElement;
