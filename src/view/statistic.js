export const createStatisticTemplate = (count) => {
  const format = new Intl.NumberFormat(`ru-RU`).format(count);
  return (
    `<p>${format} movies inside</p>`
  );
};

