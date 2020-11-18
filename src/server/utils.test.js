const connMock = require('../../__mocks__/connector.js');
const { queryCalc, queryCalcs, queryCalcResult } = require('./utils')(connMock);

const dummyReqId = '26c6a2bd-ddbc-49e8-b9fb';

test('Let`s test queryCalc utility', async () => {
    const result = await queryCalc(1);
    expect(result).toEqual(dummyReqId);
});

test('Let`s test queryCalcs utility', async () => {
    const number = 2;
    const result = await queryCalcs([number]);
    expect(result).toStrictEqual([{number, reqId: dummyReqId}]);
});

test('Let`s test queryCalcResult utility', async () => {
    const resultObj = await queryCalcResult(dummyReqId);
    expect(resultObj).toHaveProperty('result');
});