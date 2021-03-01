'use strict';

const axios = require(`axios`);
const {DEFAULT_API_PORT} = require(`../constants`);

const TIMEOUT = 10000;
const port = process.env.API_PORT || DEFAULT_API_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const {data} = await this._http.request({url, ...options});
    return data;
  }

  getOffers({comments}) {
    return this._load(`/offers`, {params: {comments}});
  }

  getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultApi = new API(defaultUrl, TIMEOUT);
module.exports = {
  API,
  getAPI: () => defaultApi
};
