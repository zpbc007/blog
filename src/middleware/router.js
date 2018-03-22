// 定义路由
const router = require('koa-router')()
const readFile = require('../util/file').readFile
const showdown = require('showdown')
const converter = new showdown.Converter()
// todo 放入数据库
const info = require('../../test/info.json')

async function getHtml () {
    const file = await readFile(path.join(__dirname, './docs/1.log.md'))
    return converter.makeHtml(file)
}

// 获取列表
async function pageList (ctx) {
    ctx.body = info
}

// 获取文章页
async function viewPage (ctx) {

}

router.get('/', pageList)
  .get('/view/:id', viewPage)



module.exports = {
    router: router.routes()
}