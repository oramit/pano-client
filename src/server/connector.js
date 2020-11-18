
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { CALCULATIONS_SERVER } = require('../consts');
const requestHeaders = { headers: { 'Content-Type': 'application/json' } };

exports.queryCalc = async (number) => {
  const response = await fetch(CALCULATIONS_SERVER, { 
    method: 'POST', 
    body: JSON.stringify({ data: number }), 
    ...requestHeaders
  });

  return response.json();
};

exports.queryCalcResult = async (reqId) => {
  const response = await fetch(`${CALCULATIONS_SERVER}?request_id=${reqId}`, { 
    ...requestHeaders
  });

  return response.json();
};
