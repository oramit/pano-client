const fs = require('fs');
const { OUTPUT_FILE, INPUT_FILE, BYTES_TO_READ } = require('./consts.js');

let chunksRead = 0;

exports.readNextChunk = async (splitter = " ") => {
    const buf = Buffer.alloc(BYTES_TO_READ, 0);
    let fd;

    try {
        fd = fs.openSync(INPUT_FILE, "r");
        fs.readSync(fd, buf, 0, BYTES_TO_READ, BYTES_TO_READ * chunksRead);
    } finally {
        if (fd) {
            fs.closeSync(fd);
        }
        chunksRead ++;
    }
    return buf.toString().split(splitter);
};

exports.initOutputFile = async () => {
    fs.writeFile(OUTPUT_FILE, '', (err) => {
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