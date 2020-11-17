const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

// const serverConn = require('./serverConnector.js');
const serverUtils = require('./server/utils');
const { SERVER_CALC_CAPACITY} = require('./common/consts.js');

module.exports = class App {
    constructor(data) {
        this.init(data);
    };

    init(data) {
        this.inputsToWorkWith = this.isInputValid(data) ? data.filter(currInput => typeof currInput === 'number') : [];
        this.totalInputsToCalc = this.inputsToWorkWith.length;
        this.requestsToPoll = [];
        // This data structure contains request status entries: 
        // Like that one for example: { bd-ddbc-49 => { input: 2, result: 4 }} for request id: 'bd-ddbc-49'
        this.accumulatedRequests = {};    
    };

    isInputValid(data) {
        return Array.isArray(data);
    };

    allInputsCalculated = () => {
        return Object.values(this.accumulatedRequests)
            .filter(resEntry => resEntry && resEntry.result).length === this.totalInputsToCalc;
    };

    parseFinalResults = () => {
        return Object.values(this.accumulatedRequests).reduce((ret, curr) => {
            ret[curr.input] = curr.result;
            return ret;
        }, {});
    };

    handleNextCalculation = async () => {
        let nextNumberToCalc = this.inputsToWorkWith.pop();
        let nextReqIdToPoll = await serverUtils.queryCalc(nextNumberToCalc);
        
        if(nextReqIdToPoll) {
            this.requestsToPoll.push(nextReqIdToPoll);
            this.accumulatedRequests[nextReqIdToPoll] = { input: nextNumberToCalc };
        }
        else { // On case we didn't get relevant request id
            this.inputsToWorkWith.push(nextNumberToCalc);
        }
    };

    handleRequest = async (reqId) => {
        const calcResponse = await serverUtils.queryCalcResult(reqId);
        
        // Accumulating data only on case we got a relevant result.
        // (Skipping on case we got a pending status from server)
        if(calcResponse.result) { 
            this.accumulatedRequests[reqId].result = calcResponse.result;
            // Removing current calculated request from polling requests array.
            this.requestsToPoll = this.requestsToPoll.length > 0 ? this.requestsToPoll.filter(req => req !== reqId) : [];

            // If we still have an input to calculate, pop the next input
            if(this.inputsToWorkWith.length > 0) {
                await this.handleNextCalculation();
            }
        }
    };

    calculate = async () => {
        const firstChunkSize = Math.min(SERVER_CALC_CAPACITY, this.totalInputsToCalc);
        const firstChunkToCalc = this.inputsToWorkWith.splice(0, firstChunkSize);
        const requestsIdsWithInput = await serverUtils.queryCalcs(firstChunkToCalc);    

        this.accumulatedRequests = requestsIdsWithInput.reduce((ret, curr) => {
            ret[curr.reqId] = { input: curr.number };
            return ret;
        },{});

        this.requestsToPoll = requestsIdsWithInput.map(reqWithNum => reqWithNum.reqId);

        return new Promise((resolve, reject) => {
            let timer = setInterval(async () => {       
                // If all numbers were calculated..
                if(this.allInputsCalculated()) {
                    clearInterval(timer);
                    resolve(this.parseFinalResults());
                }
                await Promise.all(this.requestsToPoll.map(this.handleRequest));
            }, 1000);
        });
    };
};