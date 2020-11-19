const fs = require('fs');
const { OUTPUT_FILE } = require('./consts.js');

exports.initOutputFile = async () => {
    fs.writeFile(OUTPUT_FILE, '', (err) => {
        if(err) {
            throw err;
        }
        console.log(`Output file initiated.`);
    });
};

exports.readNext = async () => {
    fs.readSync(OUTPUT_FILE, '', (err) => {
        if(err) {
            throw err;
        }
        console.log(`Output file initiated.`);
    });
};

exports.append = (appendedText, doAfterAppend) => {    
    fs.appendFile(OUTPUT_FILE, `${appendedText}\n`, (err) => {
        if(err) {
            throw err;
        }
        console.log(`File appended with: ${appendedText}`);
        doAfterAppend();
    });
};