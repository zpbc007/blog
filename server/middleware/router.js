// 定义路由
const path = require('path')
const router = require('koa-router')()
const overviewController = require('../controller/overviewController')
const viewController = require('../controller/viewController')
const configController = require('../controller/configController')

// 获取首页
async function getRootPage (ctx) {
    ctx.body = await readFile(path.join(__dirname, '../../dist/index.html'))
}

router.get('/api', overviewController.getPageList)
  .get('/api/view/:id', viewController.getViewPage)
  .get('/', getRootPage)
  .get('/api/getMarkDownList', configController.getMarkdownList)



module.exports = {
    router: router.routes()
}