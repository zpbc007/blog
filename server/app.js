// 启用alias
// require('module-alias/register')
var ora = require('ora')
var chalk = require('chalk')

const path = require('path')
const Koa = require('koa')
const staticServe = require('koa-static');
const app = new Koa()
const route = require('./middleware/router').router
const port = '80'

// 控制台
const spinner = ora('system is starting now')
spinner.start()

// 静态资源
app.use(staticServe(path.resolve(__dirname, './dist')))

// 路由
app.use(route)

app.listen(port)
spinner.stop()
console.log(chalk.cyan(`系统启动成功, 监听端口为${port}\n`))
