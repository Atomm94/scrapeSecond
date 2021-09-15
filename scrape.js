// const url = 'https://www.jbtools.com/hand-tools/#?Category0=Hand+Tools&Category1=Bit+Sockets&search_return=all&page=1';
const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile')

const scrape = async (pages) => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--single-process'
        ]
    });
    // const page = await browser.newPage();
    // await page.goto(url);
    let dataArray = [];
    let dataFinish = [];
    let url;
    let lastPageNumber = Number(pages);
    for (let index = 1; index <= lastPageNumber; index++) {
        // wait 1 sec for page load
        url = `https://www.jbtools.com/hand-tools/#?Category0=Hand+Tools&Category1=Screwdrivers&search_return=all&page=${index}`;
        const page = await browser.newPage();
        await page.goto(url);
        console.log('ok')
        await page.waitForTimeout(15000);

        dataFinish = await extractedEvaluateCall(page)
        dataFinish.map(item => {
            dataArray.push(item);
        })

        // if (index !== lastPageNumber - 1) {

        //     await page.evaluate((selector) => document.querySelector(selector).click(), `a.pagination-link[${lastPageNumber}]`);
        // }
    }
     await jsonfile.writeFileSync('product.json', dataArray, { spaces: 2 })
     await browser.close();
     console.log('finish')
     return JSON.stringify(dataArray);
};


async function extractedEvaluateCall(page) {

    return page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll(".card-figcaption-button input"));

        let add = [];

        let db = [];
        //db.push(tds)
        tds.map(input => db.push(input.value));
        return db;
    });
}

scrape(31)

// module.exports = {
//     scrape
// }