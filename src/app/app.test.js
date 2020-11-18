const App = require('./app');

const calcExpectedResult = (input) => {
    return input.reduce((ret, curr) => {
        if(typeof curr === 'number'){
            ret[curr] = Math.pow(curr, 2);
        }
        return ret;
    }, {});
};

test('Let`s test returned value and structure for a small input', async () => {
    const input = [1,2,4];
    const expectedResult = calcExpectedResult(input);

    const appInst = new App(input);
    const results = await appInst.calculate();

    expect(results).toStrictEqual(expectedResult);
});

test('Let`s test unexpected inputs', async () => {
    const input = [1, "2", "can'tCalculateMe"];
    const appInst = new App(input);
    const expectedResult = calcExpectedResult(input);

    const results = await appInst.calculate();
    expect(results).toStrictEqual(expectedResult);
});

test('Let`s test an empty array', async () => {
    const input = [];
    const appInst = new App(input);

    const results = await appInst.calculate();
    expect(results).toStrictEqual({});
});

test('Let`s test a null input', async () => {
    const input = null;
    const appInst = new App(input);

    const results = await appInst.calculate();
    expect(results).toStrictEqual({});
});