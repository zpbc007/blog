// 查看页controller
const path = require('path')
const readFile = require('../../util/file').readFile
const hljs = require('highlight.js')
const idPathMap = require('../assets/idToPath.json')

const md = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
                 hljs.highlight(lang, str, true).value +
                 '</code></pre>';
        } catch (__) {}
      }
  
      return md.utils.escapeHtml(str);
    }
})
async function getHtml (fileName) {
    const file = await readFile(path.join(__dirname, '../../docs', fileName))
    return md.render(file)
}

async function getViewPage (ctx) {
    const filePath = idPathMap[ctx.params.id]
    ctx.body = await getHtml(filePath)
}

module.exports = {
    getViewPage
}