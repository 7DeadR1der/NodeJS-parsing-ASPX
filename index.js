const { default: puppeteer } = require('puppeteer'); //подключаем puppeteer для парсинга
const fs = require("fs"); // fs для сохранения файла в json

// ---- КОНСТАНТЫ ----
const url = 'https://catalogue.ite-expo.ru/ru-RU/exhibitorlist.aspx?project_id=507';
const linkStr1 = `a[href="javascript:__doPostBack('p$lt$zoneContainer$pageplaceholder$p$lt$zoneForm$UniPager$pagerElem','`;
const linkStr2 = `')`;
const countPages = 27;
const selectorForFind = 'strong'; //уникальный селектор, для ожидания прогрузки новой страницы
// 

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    
    let fullData = [];

    for (let i = 1; i<=countPages; i++){
        if(i!=1){
            // здесь мы проходимся по страницам
            // сначала мы удаляем уникальный селектор с этой страницы, чтобы после перехода, мы смогли найти новый.
            // иначе же, если не удалять его, DOM останется с прошлой страницы (не обновится)
            let link = await page.$$(linkStr1 + i + linkStr2);
            await page.evaluate(() => document.querySelectorAll(selectorForFind)[0].remove());
            await link[0].click();
            await page.waitForSelector(selectorForFind);
        }
        let data = await page.evaluate(() => {
            //здесь ваш код может отличаться, из-за структуры необходимого вам сайта
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
        //записываем инфу в конечный массив
        fullData = fullData.concat(data);

    }
    //запись полученной инфы в JSON
    fs.writeFile(
        "response.json",
        JSON.stringify(fullData),
        err => {
        // Checking for errors 
        if (err) throw err;

        // Success 
        console.log("Done writing");
    });
    
    //console.log(fullData);
    // скрин просто для теста
    //await page.screenshot({path: 'img.png'});
    
    browser.close();
})();
