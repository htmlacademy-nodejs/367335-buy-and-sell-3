'use strict';

// Набор общих функций для работы с объявлениями

const {splitNumByThousands} = require(`../../utils`);

// Доработка одиночного объявления для шаблонизации
const modifyOffer = (offer) => {
  offer.colorIndex = offer.picture.match(/(\d+)\.jpg$/)[1];
  offer.retinaPicture = offer.picture.replace(`.jpg`, `@2x.jpg`);
  offer.outputPrice = splitNumByThousands(offer.sum);
  return offer;
};

module.exports = {
  modifyOffer
};
