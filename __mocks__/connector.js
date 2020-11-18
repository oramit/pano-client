exports.queryCalc = async (number) => {
  return Promise.resolve({request_id: '26c6a2bd-ddbc-49e8-b9fb'});
};

exports.queryCalcResult = async (reqId) => {
  return Promise.resolve({result: 'This is my result'});
};
