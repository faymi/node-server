import moment from "moment";
const puppeteer = require('puppeteer');
var path = require('path');
var fs = require('fs');

class Spiker {
    constructor() {
        this.screenshot = this.screenshot.bind(this);
        this.spideData = this.spideData.bind(this);
        this.spideManhua = this.spideManhua.bind(this);
    }

    async launch() {
        return await puppeteer.launch();
    }
    async getViewSize(page) {
        return await page.evaluate(() => {
            // window.scrollBy(0, document.documentElement.clientHeight);
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                deviceScaleFactor: window.devicePixelRatio,
                scrollWidth: document.documentElement.scrollWidth,
                scrollHeight: document.documentElement.scrollHeight
            }
        });
    }
    async getCookie(page) {
        const cookieArr = await page.evaluate(() => {
            return document.cookie.match(/(\w+)=([\w\\/.%-_#@!$&~]+)/g);
        });
        let cookie = {};
        cookieArr.forEach((v, k) => {
            const item = v.split('=');
            const key = item[0];
            const val = item[1];
            cookie[key] = val;
        });
        return cookie;
    }
    async screenshot(req, res, next) {
        let url = req.body.url;
        const browser = await this.launch();
        const page = await browser.newPage();
        try {
            await page.goto(decodeURIComponent(url), {
                waitUntil: 'networkidle2'
            });
            const dimensions = await this.getViewSize(page);
    
            await page.setViewport({
                width: dimensions.scrollWidth,
                height: dimensions.scrollHeight,
                isMobile: false,
                deviceScaleFactor: 1
            });
        } catch (error) {
            res.json({
                code: 1500,
                data: null,
                msg: '地址不正确！'
            });
            return;
        }

        let time = moment().format('YYYYMMDDhhmmss');
        let imgPath = path.join(__dirname, '../../public/screenshot/');
        fs.access(imgPath, async (err) => {
            if(err) {
                console.log(`${imgPath}不存在`);
                fs.mkdirSync(imgPath);
            }
            try {
                await page.screenshot({path: imgPath + time + '.png'});
                // await this.screenshotDOMElement(page, '.movie-grid', 'screenshop.png');
    
                await browser.close();
    
                res.json({
                    code: 0,
                    data: {},
                    msg: '截图成功！'
                });
            } catch (error) {
                res.json({
                    code: 1500,
                    data: null,
                    msg: error
                });
            }
        });
    }
    async screenshotDOMElement(page, selector, path, padding = 0) {
        const rect = await page.evaluate(selector => {
            try{
                const element = document.querySelector(selector);
                const {x, y, width, height} = element.getBoundingClientRect();
                if(width * height != 0){
                    return {left: x, top: y, width, height, id: element.id};
                }else{
                    return null;
                }
            }catch(e){
                return null;
            }
        }, selector);
        
        return await page.screenshot({
            path: path,
            clip: rect ? {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
            } : null
        });
    }
    async spideData(req, res, next) {
        console.log('开始')
        let url = 'https://buy.autohome.com.cn/0/0/0/440000/440100/0-0-0-0.html#pvareaid=2113193';
        const browser = await this.launch();
        console.log('浏览器启动')
        let page = await browser.newPage();
        await page.goto(decodeURIComponent(url), {
            waitUntil: 'networkidle2'
        });

        // 获取页面标题
        let title = await page.title();
        console.log(title);
        console.log('服务正常')

        // 获取车源列表
        const CAR_LIST_SELECTOR = '.pricebox.recombox.cutprice';
        const carList = await page.evaluate((sel) => {
          const carBoxs = [].slice.call(($(sel).find('#div-content ul li')));
          const ctn = carBoxs.map(v => {
            const title = $(v).find('.carname .text').text();
            const price = $(v).find('.price span').text();
            const imgUrl = $(v).find('.pic img').attr('src');
            const saleNum = $(v).find('.jump .explain-car').text();
            const thriftPrice = $(v).find('.jump .explain-price').text();
            return {
              title: title,
              price: price,
              img: imgUrl,
              saleNum: saleNum,
              thriftPrice: thriftPrice
            };
          });
          return ctn;
        }, CAR_LIST_SELECTOR);

        console.log(`总共${carList.length}辆汽车数据: `, JSON.stringify(carList, undefined, 2));

        // 将车辆信息写入文件
        let writerStream = fs.createWriteStream('car_info_list.json');
        writerStream.write(JSON.stringify(carList, undefined, 2), 'UTF8');
        writerStream.end();

        await browser.close()
        console.log('服务正常结束');
        res.json({
          code: 0,
          data: carList,
          msg: 'success'
        })
    }

    async spideManhua(req, res, next) {
        console.log('开始')
        let url = 'https://manhua.fzdm.com/39/91/index_0.html';
        const browser = await this.launch();
        console.log('浏览器启动')
        let page = await browser.newPage();
        await page.goto(decodeURIComponent(url), {
            waitUntil: 'networkidle2'
        });

        let count = 0;
        await this.getManhuaData(page, count);
        console.log(count);

        await browser.close()
        console.log('服务正常结束');
        res.json({
          code: 0,
          data: '',
          msg: 'success'
        });
    }

    async getManhuaData(page, count) {
        // 获取页面标题
        var title = await page.title();
        console.log(title);
        const cookie = await this.getCookie(page);
        // 图片主机地址
        const picHost = decodeURIComponent(cookie.picHost);
        // 获取图片
        const CAR_LIST_SELECTOR = '#pjax-container';
        var img = await page.evaluate((sel) => {
          const pic = $(sel).find('#mhimg0 a img').attr('src');
          return pic;
        }, CAR_LIST_SELECTOR);

        const picSrc = /^http:\/\/\//g.test(img) ? img.replace(/http:\/\//g, picHost) : img;
        console.log(`图片数据: `, picSrc);

        const nextButtonClassName = '.navigation a.pure-button.pure-button-primary';
        // let nextBtn = await page.$(nextButtonClassName);
        await page.$eval(nextButtonClassName, el => {
            el.forEach(async n => {
                if(n.innerText !== '下一话吧') {
                    await nextBtn[1].click();
                    count++;
                    // await page.waitFor(2500);
                    await page.waitForNavigation();
                    await this.getManhuaData(page, count);
                }
            });
        });
    }

}

export default new Spiker();