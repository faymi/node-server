import moment from "moment";
const puppeteer = require('puppeteer');
var path = require('path');

class Spiker {
    constructor() {
        this.screenshot = this.screenshot.bind(this);
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
    async screenshot(req, res, next) {
        let url = req.body.url;
        const browser = await this.launch();
        const page = await browser.newPage();
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

        let time = moment().format('YYYYMMDDhhmmss');
        let imgPath = path.join(__dirname, '../../public/screenshot/');
        await page.screenshot({path: imgPath + time + '.png'});
        // await this.screenshotDOMElement(page, '.movie-grid', 'screenshop.png');

        await browser.close();

        res.json({
            code: 0,
            data: {},
            msg: '截图成功！'
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

}

export default new Spiker();