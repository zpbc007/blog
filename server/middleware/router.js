// 定义路由
const path = require('path')
const router = require('koa-router')()
const readFile = require('../../util/file').readFile
const markdown = require('markdown-it')
const hljs = require('highlight.js');
// Actual default values
const md = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
                 hljs.highlight(lang, str, true).value +
                 '</code></pre>';
        } catch (__) {}
      }
  
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
// todo 放入数据库
const info = require('../assets/info.json')
const idPathMap = require('../assets/idToPath.json')

async function getHtmlByMd (fileName) {
    const file = await readFile(path.join(__dirname, '../../docs', fileName))
    return md.render(file)
}

// 获取列表
async function pageList (ctx) {
    ctx.body = info
}

// 获取文章页
async function viewPage (ctx) {
    const filePath = idPathMap[ctx.params.id]
    ctx.body = await getHtmlByMd(filePath)
}

// 获取首页
async function getRootPage (ctx) {
    ctx.body = await readFile(path.join(__dirname, '../../dist/index.html'))
}

router.get('/api', pageList)
  .get('/api/view/:id', viewPage)
  .get('/', getRootPage)



module.exports = {
    router: router.routes()
}