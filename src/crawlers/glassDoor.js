async function glassDoor({
  puppeteer,
  createFiles,
  includeWords,
  excludeWords
}) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(
    'https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=developer&sc.keyword=developer&locT=C&locId=2440450&jobType='
  );
  const results = await page.evaluate(
    (includeWords, excludeWords) => {
      const jobs = [...document.querySelectorAll('li.jl')];
      let possibleMatches = [];
      for (let i = 0; i < jobs.length; i++) {
        let innerHTML = jobs[i].textContent.replace(/\s/g, '').toLowerCase();
        if (
          includeWords.some(keyword => innerHTML.indexOf(keyword) > -1) &&
          excludeWords.every(keyword => innerHTML.indexOf(keyword) < 0)
        ) {
          possibleMatches.push({
            jobTitle: jobs[
              i
            ].childNodes[1].childNodes[0].childNodes[0].textContent.trim(),
            company: jobs[i].childNodes[1].childNodes[1].textContent
              .trim()
              .split('–')[0]
              .trim(),
            link: jobs[i].childNodes[0].childNodes[0].href
          });
        }
      }
      return possibleMatches;
    },
    includeWords,
    excludeWords
  );
  await createFiles('glasDoor', results, (error, data) => {
    if (error) console.log('Error writing files');
    else console.log('Has written');
  });
  return await browser.close();
}
module.exports = glassDoor;
