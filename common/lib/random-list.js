'use strict';

module.exports = function randomList(amount, max) {
  const result = [];
  let num = 0;
  while (result.length < amount) {
    const randomNum = Math.round(Math.random() * (max - 0));
    if (result.indexOf(randomNum) === -1) result.push(randomNum);
    num++;
  }

  result.sort(sortNumber);

  console.log(`There were ${num} attempts to get ${amount} random indexes`);
  console.log(`The random indexes are ${result}`);

  return result;
};

function sortNumber(a, b) {
  return a - b;
};
