const App = require('./app.js');
const filesUtils = require('./filesUtils.js');

(async function run() {
    const startTime = new Date();

    filesUtils.initOutputFile();

    const appInst = new App();
    console.log('Calculations client was created successfully..');

    appInst.init();
    await appInst.calculate();
    
    console.log(`Finished calculating after ${new Date().getTime() - startTime.getTime()} miliseconds.`);
})();