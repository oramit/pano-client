exports.queryCalc = async (number) => {
  console.log("---inside mock---");
  console.log("---inside mock---");
  console.log("---inside mock---");
  console.log("---inside mock---");
  return Promise.resolve({request_id: '26c6a2bd-ddbc-49e8-b9fb'});
};

exports.queryCalcResult = async (reqId) => {
  return Promise.resolve({result: 4})
};
