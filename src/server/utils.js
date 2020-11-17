const connector = require('./connector');

exports.queryCalc = async (number) => {
  const response = await connector.queryCalc(number);
  return response.request_id;
};

exports.queryCalcResult = async (reqId) => {
  const response = await connector.queryCalcResult(reqId);
  return response;
};

exports.queryCalcs = async (numbersArray) => {
  const calcs = await Promise.all(numbersArray.map(async number => {
    const reqId = await this.queryCalc(number);
    return { number, reqId };
  }));

  return calcs;
};
