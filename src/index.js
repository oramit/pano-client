const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { numbers } = require('./data.js');
const serverConnector = require('./serverConnector.js');
const { SERVER_CALC_CAPACITY} = require('./common/consts.js');

let requestsToPoll = [];
let results = {};

async function startCalculate() {
    let requestsIdsWithInput = await serverConnector.queryCalcs(numbers.splice(0, SERVER_CALC_CAPACITY));    

    results = requestsIdsWithInput.reduce((ret, curr) => {
        ret[curr.reqId] = { input: curr.number };
        return ret;
    },{});

    requestsToPoll = requestsIdsWithInput.map(reqWithNum => reqWithNum.reqId);

    setInterval(() => {
        Promise.all(requestsToPoll.map(reqId => {
            serverConnector.queryCalcResult(reqId).then(result => {
                results[reqId].result = result;
                requestsToPoll = requestsToPoll.filter(req => req !== reqId);
                let nextNumberToCalc = numbers.pop();
                serverConnector.queryCalc(nextNumberToCalc).then(reqId => {
                    requestsToPoll.push(reqId);
                    results[reqId] = { input: nextNumberToCalc };
                });
            });    
        }));
    }, 1000);
}

startCalculate();