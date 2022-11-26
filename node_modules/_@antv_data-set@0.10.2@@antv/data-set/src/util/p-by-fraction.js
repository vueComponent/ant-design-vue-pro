module.exports = fraction => {
  const step = 1 / fraction;
  const pArr = [];
  for (let i = 0; i <= 1; i = i + step) {
    pArr.push(i);
  }
  return pArr;
};
