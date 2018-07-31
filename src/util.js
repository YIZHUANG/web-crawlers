const fs = require('fs');
const path = require('path');
const util = require('util');

const asyncReadFile = util.promisify(fs.readFile);
const asyncReadDir = util.promisify(fs.readdir);
const baseDir = path.join(__dirname, '/data/');

function createFiles(file, data, callback) {
  /*
  fs.exists(baseDir + file + '.json', exists => {
    if (exists) {
      console.log('unLinking data...');
      fs.unlink(baseDir + file + '.json', () => {
        console.log('writing data....');
        fs.writeFile(baseDir + file + '.json', JSON.stringify(data), () => {
          callback();
        });
      });
    } else {
      console.log('writing data....');
      fs.writeFile(baseDir + file + '.json', JSON.stringify(data), () => {
        callback();
      });
    }
  });
  */
  return new Promise((res, rej) => {
    fs.writeFile(
      baseDir + file + '.json',
      JSON.stringify(data),
      (error, data) => {
        if (error) rej(callback(error));
        res(callback(error, data));
      }
    );
  });
}

async function readAllfiles() {
  const dataArray = [];
  const fileNames = await asyncReadDir(baseDir);
  for (let fileName of fileNames) {
    const fileData = await readFile(fileName);
    dataArray.push(...JSON.parse(fileData));
  }
  return dataArray;
}

async function readFile(file) {
  return await asyncReadFile(baseDir + file, 'utf8');
}

exports.createFiles = createFiles;
exports.readAllfiles = readAllfiles;
