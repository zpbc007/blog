// 启用alias
// require('module-alias/register')
var ora = require('ora')
var chalk = require('chalk')

const path = require('path')
const Koa = require('koa')
const app = new Koa()
const route = require('./middleware/router').router

// 控制台
const spinner = ora('system is starting now')
spinner.start()

// 路由
app.use(route)

app.listen('8088')
spinner.stop()
console.log(chalk.cyan('系统启动成功, 监听端口为8088\n'))
