const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const { allInputsCalculated, parseFinalResults, isInputValid } = require('./appUtils');
const serverConnector = require('../server/connector');
const serverUtils = require('../server/utils')(serverConnector);

const { SERVER_CALC_CAPACITY} = require('../consts.js');

module.exports = class App {
    constructor(data) {
        this.inputsToWorkWith = isInputValid(data) ? data.filter(currInput => typeof currInput === 'number') : [];
        this.totalInputsToCalc = this.inputsToWorkWith.length;

        this.requestsToPoll = [];
        // This data structure contains request status entries: 
        // Like that one for example: { bd-ddbc-49 => { input: 2, result: 4 }} for request id: 'bd-ddbc-49'
        this.accumulatedRequests = {};
    };

    handleNextCalculation = async () => {
        const nextNumberToCalc = this.inputsToWorkWith.pop();
        const nextReqIdToPoll = await serverUtils.queryCalc(nextNumberToCalc);
        
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
           
            console.log(`Result accumulated: ${this.accumulatedRequests[reqId].input} ==> ${this.accumulatedRequests[reqId].result}`);

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
            const timer = setInterval(() => {       
                // If all numbers were calculated..
                if(allInputsCalculated(this.accumulatedRequests, this.totalInputsToCalc)) {
                    clearInterval(timer);
                    resolve(parseFinalResults(this.accumulatedRequests));
                }
                Promise.all(this.requestsToPoll.map(this.handleRequest));
            }, 1000);
        });
    };
};