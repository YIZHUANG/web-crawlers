async function indeed({ puppeteer, createFiles, includeWords, excludeWords }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(
    'https://www.indeed.fi/jobs?q=Developer&l=Helsinki&jt=fulltime&sort=date'
  );
  await page.waitForSelector('body', {
    visible: true
  });
  const finalResult = [];
  await page.exposeFunction('pushResult', array => finalResult.push(array));
  await page.evaluate(
    (includeWords, excludeWords) => {
      const results = [];
      let jobContainer = [
        ...document.querySelectorAll('.row.result.clickcard')
      ];
      const possibleMatches = jobContainer.filter(content => {
        const jobTitle = content.childNodes[0].nextSibling.childNodes[1].textContent
          .replace(/\s/g, '')
          .toLowerCase();
        return (
          includeWords.some(keyword => jobTitle.indexOf(keyword) > -1) &&
          excludeWords.every(keyword => jobTitle.indexOf(keyword) < 0)
        );
      });
      for (let i = 0; i < possibleMatches.length; i++) {
        const jobTitle =
          possibleMatches[i].childNodes[0].nextSibling.childNodes[1]
            .textContent;
        const link =
          possibleMatches[i].childNodes[0].nextSibling.childNodes[1].href;
        const company = possibleMatches[
          i
        ].childNodes[2].nextSibling.textContent.trim();
        window.pushResult({
          jobTitle,
          link,
          company
        });
      }
    },
    includeWords,
    excludeWords
  );
  await page.goto(
    'https://www.indeed.fi/jobs?q=Developer&l=Helsinki&jt=fulltime&sort=date&start=10'
  );
  await page.waitForSelector('#popover-form-container', {
    visible: true
  });
  await page.click('a.icl-CloseButton');
  await page.evaluate(
    (includeWords, excludeWords) => {
      const results = [];
      let jobContainer = [
        ...document.querySelectorAll('.row.result.clickcard')
      ];
      const possibleMatches = jobContainer.filter(content => {
        const jobTitle = content.childNodes[0].nextSibling.childNodes[1].textContent
          .replace(/\s/g, '')
          .toLowerCase();
        return (
          includeWords.some(keyword => jobTitle.indexOf(keyword) > -1) &&
          excludeWords.every(keyword => jobTitle.indexOf(keyword) < 0)
        );
      });
      for (let i = 0; i < possibleMatches.length; i++) {
        const jobTitle =
          possibleMatches[i].childNodes[0].nextSibling.childNodes[1]
            .textContent;
        const link =
          possibleMatches[i].childNodes[0].nextSibling.childNodes[1].href;
        const company = possibleMatches[
          i
        ].childNodes[2].nextSibling.textContent.trim();
        window.pushResult({
          jobTitle,
          link,
          company
        });
      }
    },
    includeWords,
    excludeWords
  );

  await createFiles('indeed', finalResult, (error, data) => {
    if (error) console.log('Error writing files');
    else console.log('Has written');
  });

  return await browser.close();
}
export default indeed;
