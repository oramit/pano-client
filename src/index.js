const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { numbers } = require('./data.js');
const serverConnector = require('./serverConnector.js');
const { SERVER_CALC_CAPACITY} = require('./common/consts.js');

const totalNumbersToCalc = numbers.length;
let requestsToPoll = [];
let results = {};

async function startCalculate() {
    let requestsIdsWithInput = await serverConnector.queryCalcs(numbers.splice(0, SERVER_CALC_CAPACITY));    

    results = requestsIdsWithInput.reduce((ret, curr) => {
        ret[curr.reqId] = { input: curr.number };
        return ret;
    },{});

    requestsToPoll = requestsIdsWithInput.map(reqWithNum => reqWithNum.reqId);

    let timer = setInterval(() => {
        Promise.all(requestsToPoll.map(reqId => {
            serverConnector.queryCalcResult(reqId).then(result => {
                results[reqId].result = result;
                requestsToPoll = requestsToPoll.length > 0 ? requestsToPoll.filter(req => req !== reqId) : [];
                
                if(numbers.length > 0) {
                    let nextNumberToCalc = numbers.pop();
                    serverConnector.queryCalc(nextNumberToCalc).then(reqId => {
                        requestsToPoll.push(reqId);
                        results[reqId] = { input: nextNumberToCalc };
                    });
                }
                // If all numbers were calculated..
                if(Object.values(results).filter(resEntry => resEntry && resEntry.result).length === totalNumbersToCalc) {
                    clearInterval(timer);
                }
            });    
        }));
    }, 1000);
}

startCalculate();