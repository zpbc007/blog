// 定义路由
const path = require('path')
const router = require('koa-router')()
const readFile = require('../util/file').readFile
const showdown = require('showdown')
const converter = new showdown.Converter()
// todo 放入数据库
const info = require('../../test/info.json')
const idPathMap = require('../../test/idToPath.json')

async function getHtml (fileName) {
    const file = await readFile(path.join(__dirname, '../../docs', fileName))
    return converter.makeHtml(file)
}

// 获取列表
async function pageList (ctx) {
    ctx.body = info
}

// 获取文章页
async function viewPage (ctx) {
    const filePath = idPathMap[ctx.params.id]
    ctx.body = await getHtml(filePath)
}

router.get('/', pageList)
  .get('/view/:id', viewPage)



module.exports = {
    router: router.routes()
}