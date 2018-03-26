// 列表页controller

// todo 放入数据库
const info = require('../assets/info.json')

// 获取列表
async function getPageList (ctx) {
    ctx.body = info
}

module.exports = {
    getPageList
}