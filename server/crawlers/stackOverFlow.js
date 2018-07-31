async function stackOverFlow(
  puppeteer,
  createFiles,
  includeWords,
  excludeWords
) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const results = [];
  const page = await browser.newPage();
  await page.goto(
    'https://stackoverflow.com/jobs?q=developer&l=Helsinki%2c+Finland&d=20&u=Km&sort=p'
  );
  const possibleMatches = await page.evaluate(
    (includeWords, excludeWords) => {
      let jobLinks = [
        ...document.querySelectorAll('.job-details__spaced>a.job-link')
      ];
      return jobLinks
        .map(link => link.href.replace(/\s/g, '').toLowerCase())
        .filter(
          text =>
            includeWords.some(keyword => text.indexOf(keyword) > -1) &&
            excludeWords.every(keyword => text.indexOf(keyword) < 0)
        );
    },
    includeWords,
    excludeWords
  );
  for (let possibleMatch of possibleMatches) {
    await page.goto(possibleMatch, { waitUntil: 'networkidle0' });
    const jobDescription = await page.$eval('.job-details__spaced .mb32', el =>
      el.textContent.replace(/\s/g, '')
    );
    const jobTitle = await page.$eval('.fs-headline1', el => el.textContent);
    const company = await page.$eval('.fc-black-700', el =>
      el.textContent.split('|')[0].trim()
    );
    /*
    if (jobDescription.toLowerCase().indexOf('react') > -1) {
      results.push({
        jobTitle,
        link: possibleMatch,
        company
      });
    }
    */
    results.push({
      jobTitle,
      link: possibleMatch,
      company
    });
  }
  await createFiles('stackOverFlow', results, (error, data) => {
    if (error) console.log('Error writing files');
    else console.log('Has written');
  });
  return await browser.close();
}
export default stackOverFlow;
