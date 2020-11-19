module.exports = (connector) => {
  const queryCalc = async (number) => {
    const response = await connector.queryCalc(number);
    return response.data && response.data.request_id;
  };

  const queryCalcResult = async (reqId) => {
    const response = await connector.queryCalcResult(reqId);
    return response.data;
  };

  const queryCalcs = async (numbersArray) => {
    const calcs = await Promise.all(numbersArray.map(async number => {
      const reqId = await queryCalc(number);
      return { number, reqId };
    }));
  
    return calcs;
  };

  return {
    queryCalc,
    queryCalcs,
    queryCalcResult
  }
};