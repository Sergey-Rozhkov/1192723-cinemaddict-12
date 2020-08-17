import {MAX_DAY_GAP} from "../const";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return (lower + Math.random() * (upper - lower)).toFixed(1);
};

export const getRandomElements = (data, count) => {
  const tmp = data.slice();
  let result = [];

  for (let i = 0; i < count; i++) {
    let elementInd = getRandomInteger(0, tmp.length - 1);
    result = result.concat(tmp.splice(elementInd, 1));
  }

  return result;
};

export const getRandomElement = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);

  return data[randomIndex];
};

export const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAY_GAP, MAX_DAY_GAP);
  const currentDate = new Date();

  currentDate.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));

  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};
