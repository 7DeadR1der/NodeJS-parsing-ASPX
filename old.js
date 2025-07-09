// сюда я просто убрал старый код, который просто для теста
// 
let link = await page.$$(`a[href="javascript:__doPostBack('p$lt$zoneContainer$pageplaceholder$p$lt$zoneForm$UniPager$pagerElem','27')`);
    let curPage = await page.$$('strong');
    //await curPage[0].remove();
    await page.evaluate(() => document.querySelectorAll('strong')[0].remove());
    await link[0].click();
    await page.waitForSelector('strong');
    //await page.waitForSelector(`a[href="/ru-RU/specialpages/exhibitor_view.aspx?project_id=507&exhibitor_id=81117&itemid=121149"]`);
    
    // await Promise.all([
    //     link[0].click(),
    //     page.waitForSelector('strong'),
    //     //page.waitForSelector(`a[href="/ru-RU/specialpages/exhibitor_view.aspx?project_id=507&exhibitor_id=81117&itemid=121149"]`),

    // ]);
    //let html = await page.content();
    //console.log(html);
    //await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // код парсинга страницы
    let data = await page.evaluate(() => {
        //let link = document.querySelectorAll(`a[href="javascript:__doPostBack('p$lt$zoneContainer$pageplaceholder$p$lt$zoneForm$UniPager$pagerElem','27')`);
        //link[0].click();
        //page.waitForSelector('strong'),
        //page.waitForSelector(`a[href="/ru-RU/specialpages/exhibitor_view.aspx?project_id=507&exhibitor_id=81117&itemid=121149"]`);

        // let a = document.querySelectorAll(`a[href="javascript:__doPostBack('p$lt$zoneContainer$pageplaceholder$p$lt$zoneForm$UniPager$pagerElem','27')`);
        // a[0].click();

        let responseArr = [];
        let rows = document.querySelectorAll("a[target='popUpFrame']");
        rows.forEach(row => {
            let arr = [];
            arr.push(row.href);
            let div = row.querySelectorAll("div");
            div.forEach(el => {
                let str = el.innerText;
                str.replace("<br/>","");
                arr.push(str);
            });
            responseArr.push(arr)
        });
        return responseArr;
    });