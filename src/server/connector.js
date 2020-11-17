
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { CALCULATIONS_SERVER } = require('../common/consts');

exports.queryCalc = async (number) => {
  const response = await fetch(CALCULATIONS_SERVER, { method: 'POST', body: JSON.stringify({ data: number }), headers: { 'Content-Type': 'application/json' } });
  return response.json();
};

exports.queryCalcResult = async (reqId) => {
  const response = await fetch(`${CALCULATIONS_SERVER}?request_id=${reqId}`, { headers: { 'Content-Type': 'application/json' }});
  return response.json();
};
