require('module-alias/register')
const path = require('path')
const showdown = require('showdown')
const readFile = require('@util/file.js').readFile

const converter = new showdown.Converter()

async function getHtml () {
    const file = await readFile(path.join(__dirname, './docs/1.log.md'))
    console.log(converter.makeHtml(file))
}

getHtml()


