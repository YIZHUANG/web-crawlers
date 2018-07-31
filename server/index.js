import puppeteer from 'puppeteer';
import express from 'express';
import bodyParser from 'body-parser';
import { createFiles, readAllfiles } from './util';
import { stackOverFlow, glassDoor, indeed } from './crawlers';
//import { includeWords, excludeWords } from './keywords';

const app = express();
app.use(bodyParser.json());

app.post('/api/startCrawling', async (req, res) => {
  const { includeWords, excludeWords } = req.body;
  const packager = {
    // funny name ha?
    puppeteer,
    createFiles,
    includeWords,
    excludeWords
  };
  await glassDoor(packager);
  await stackOverFlow(packager);
  await indeed(packager);
  //await linkedin(puppeteer, createFiles, includeWords, excludeWords);
  const data = await readAllfiles();
  res.send(data);
});
app.get('/api/readFiles', (req, res) => {
  readAllfiles()
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../../client', 'build', 'index.html')
    );
  });
}
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('server is running at port ' + PORT);
});
