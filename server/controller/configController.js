// 配置页面

const path = require('path')
const readFile = require('../../util/file')
const idToPath = require('../assets/idToPath.json')

// 获取没有id的文档
async function getMarkdownList (ctx) {
    // 所有markdown文件
    let files = await readFile.getFileNames(path.resolve(__dirname, '../../docs'))
    
    // 只返回没有id的
    _createReverseObj(idToPath)
    let noIdFiles = []
    for (let file of files) {
        if (!idToPath[file]) {
            noIdFiles.push(file)
        }
    }

    let result = []
    for (let file of noIdFiles) {
        result.push({
            label: file,
            value: file
        })
    }

    ctx.body = result
}

function _createReverseObj (obj) {
    let keys = Object.keys(obj)
    for (let key of keys) {
        obj[obj[key]] = key
    }
}

module.exports = {
    getMarkdownList
}