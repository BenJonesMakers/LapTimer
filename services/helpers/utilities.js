const generateRandomNumber = (max, min) => {
  return Math.random() * (max - min) + min;
}

module.exports = generateRandomNumber;