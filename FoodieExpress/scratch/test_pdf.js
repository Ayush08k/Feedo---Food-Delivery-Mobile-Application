const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    const html = `
        <div style="page-break-after: always;">Blank 1</div>
        <div style="page-break-after: always;">Blank 2</div>
        <div style="page-break-after: always;">Blank 3</div>
        <div>Target Page (Should be numbered 4)</div>
    `;
    
    await page.setContent(html);
    await page.pdf({
        path: 'test_numbering.pdf',
        displayHeaderFooter: true,
        footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;">Page <span class="pageNumber"></span></div>',
        pageRanges: '4',
        margin: { top: '20px', bottom: '20px' }
    });
    
    await browser.close();
    console.log('Test PDF generated. Check if the page number is 4.');
})();
