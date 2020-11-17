const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { CALCULATIONS_SERVER } = require('./common/consts.js');

exports.queryCalc = (number) => {
  return fetch(CALCULATIONS_SERVER, { method: 'POST', body: { data: number } })
    .then(response => response.json())
    .then(responseData => responseData.request_id);
};

exports.queryCalcs = (numbersArray) => {
  return Promise.all(numbersArray.map(number => this.queryCalc(number).then(reqId => ({
    number,
    reqId
  }))));
};

exports.queryCalcResult = (reqId) => {
  return fetch(`${CALCULATIONS_SERVER}?request_id=${reqId}`)
    .then(res => res.json());
};