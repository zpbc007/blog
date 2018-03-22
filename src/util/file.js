const fs = require('fs')

// 文件相关操作

function readFile (path) {
    return new Promise((resolve, reject) => {
        console.group('读取文件')
        console.log(`开始读取文件: ${path}`)
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                throw new Error(`读取文件: ${path} 出错`)
                reject()
            } else {    
                console.log(`文件读取结束: ${path}`)
                console.groupEnd()
                resolve(data)
            }
        })
    })
}

module.exports = {
    readFile
}