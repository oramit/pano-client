const appUtils = require('./appUtils');

test('Let`s test \'isInputValid\' method', async () => {
    expect(appUtils.isInputValid([1,2,4])).toBe(true);
    expect(appUtils.isInputValid(null)).toBe(false);
});

test('Let`s test \'allInputsCalculated\' method', async () => {
    const resultsToCalculate = 3;
    const dummyFullyAccumulated = {
        'reqId_1': { input: 1, result: 1 },
        'reqId_2': { input: 2, result: 4 },
        'reqId_3': { input: 3, result: 9 }
    };

    expect(appUtils.allInputsCalculated(dummyFullyAccumulated, resultsToCalculate)).toBe(true);

    const dummyNotAccumulated = {
        'reqId_1': { input: 1, result: 1 },
        'reqId_2': { input: 2, result: 4 },
        'reqId_3': { input: 3, res: 9 }
    };

    expect(appUtils.allInputsCalculated(dummyNotAccumulated, resultsToCalculate)).toBe(false);
});

test('Let`s test \'parseFinalResults\' method', async () => {
    const dummy = {
        'reqId_1': { input: 1, result: 1 },
        'reqId_2': { input: 2, result: 4 },
        'reqId_3': { input: 3, result: 9 }
    };

    const dummyFinalResults = {
        '1' : 1,
        '2' : 4,
        '3' : 9 
    };

    expect(appUtils.parseFinalResults(dummy)).toStrictEqual(dummyFinalResults);
});