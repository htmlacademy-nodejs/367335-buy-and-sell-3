'use strict';

// Набор общих функций для работы с объявлениями

const {StatusCodes} = require(`http-status-codes`);
const {splitNumByThousands, formatNumWithLead0, ensureArray, getUrlJson} = require(`../../utils`);
const api = require(`../api`).getAPI();

// Доработка одиночного объявления для шаблонизации
const modifyOffer = (offer) => {
  const [, colorIndex] = offer.picture.match(/(\d+)\..*$/) || [0, 1];
  offer.colorIndex = formatNumWithLead0(colorIndex);
  offer.outputPrice = splitNumByThousands(offer.sum);
  return offer;
};

// Отправляет объявление и предзаполняет доп. данные для форм из адресной строки
const sendOffer = async (req, res) => {
  const {user} = req.session;
  const {body, file, params: {id = null}} = req;
  const context = `/offers/${id ? `edit/${id}` : `add`}`;
  const offerData = {
    ...body,
    userId: user.id,
    categories: ensureArray(body.categories).map(Number).filter(Boolean),
    sum: Number(body.sum),
    picture: file ? file.filename : body.picture_uploaded // если пользователь не загрузил новую картинку, оставляем прежнюю
  };
  delete offerData._csrf;
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
    res.redirect(`${context}?payload=${getUrlJson(offerData)}&errors=${getUrlJson(err.response.data)}`);
  }
};

module.exports = {
  modifyOffer,
  sendOffer
};
