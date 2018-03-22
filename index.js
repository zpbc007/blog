require('module-alias/register')
const path = require('path')
const showdown = require('showdown')
const readFile = require('@util/file.js').readFile
const Koa = require('koa')
const app = new Koa()

const converter = new showdown.Converter()

async function getHtml () {
    const file = await readFile(path.join(__dirname, './docs/1.log.md'))
    return converter.makeHtml(file)
}



app.use(async ctx => {
    ctx.body = await getHtml()
})

app.listen('3000')

