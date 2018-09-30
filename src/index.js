const puppeteer = require('puppeteer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');

const { createFiles, readAllfiles } = require('./util');
const { stackOverFlow, glassDoor, indeed } = require('./crawlers');

const app = express();
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  mkdirp(path.resolve(__dirname, 'data'), function(err) {
    if (err) console.error(err);
    else
      res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
  });
});

app.post('/api/startCrawling', async (req, res) => {
  const { includeWords, excludeWords } = req.body;
  const bundle = {
    puppeteer,
    createFiles,
    includeWords,
    excludeWords
  };
  await glassDoor(bundle);
  await stackOverFlow(bundle);
  await indeed(bundle);
  const data = await readAllfiles();
  res.send(data);
});
app.get('/api/readFiles', (req, res) => {
  readAllfiles()
    .then(data => res.send(data))
    .catch(error => console.log(error));
});

module.exports = app;
