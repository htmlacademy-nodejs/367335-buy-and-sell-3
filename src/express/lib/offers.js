'use strict';

// Набор общих функций для работы с объявлениями

const {StatusCodes} = require(`http-status-codes`);
const {splitNumByThousands, formatNumWithLead0, ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();

// Доработка одиночного объявления для шаблонизации
const modifyOffer = (offer) => {
  const colorIndex = offer.picture ? offer.picture.match(/(\d+)\.jpg$/)[1] : 1;
  offer.colorIndex = formatNumWithLead0(colorIndex);
  offer.outputPrice = splitNumByThousands(offer.sum);
  return offer;
};

// Отправляет объявление и предзаполняет доп. данные для форм из адресной строки
const sendOffer = async (req, res) => {
  const {body, file, params: {id = null}} = req;
  const context = `/offers/${id ? `edit/${id}` : `add`}`;
  const offerData = {
    ...body,
    userId: 1, // временная заглушка для прохождения валидации
    categories: ensureArray(body.categories).map(Number).filter(Boolean),
    sum: Number(body.sum),
    picture: file ? file.filename : body.picture_uploaded // если пользователь не загрузил новую картинку, оставляем прежнюю
  };
  delete offerData.picture_uploaded;

  try {
    if (id) {
      await api.updateOffer(id, offerData);
      res.redirect(context);
    } else {
      await api.createOffer(offerData);
      res.status(StatusCodes.CREATED).redirect(`/my`);
    }
  } catch (err) {
    // передаем ранее заполненные данные для пробрасывания в форму
    const payloadStr = encodeURIComponent(JSON.stringify(offerData));

    const errorStr = encodeURIComponent(JSON.stringify(err.response.data));

    res.redirect(`${context}?payload=${payloadStr}&errors=${errorStr}`);
  }
};

module.exports = {
  modifyOffer,
  sendOffer
};
