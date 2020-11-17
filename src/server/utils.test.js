jest.mock('./connector');

const utils = require('./utils');

test('new api test', async () => {
    const result = await utils.queryCalc(1);
    expect(result).toStrictEqual({request_id: '26c6a2bd-ddbc-49e8-b9fb'});
});