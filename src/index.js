const App = require('./app/app.js');
const { numbers } = require('./data.js');

(async function run() {
    const startTime = new Date();

    const appInst = new App(numbers);
    
    console.log('Calculations client was created successfully..');

    const results = await appInst.calculate();
    
    console.log(`Calculated results:\n`, JSON.stringify(results));
    console.log(`Finished calculating after ${new Date().getTime() - startTime.getTime()} miliseconds.`);
})();