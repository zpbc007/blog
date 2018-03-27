const fs = require('fs')

// 文件相关操作

// 读取文件
function readFile (path) {
    return new Promise((resolve, reject) => {
        console.group('--->')
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

async function _getFileNames (path, result) {
    const files = await _readdir(path)
    for (let file of files) {
        const filePath = `${path}/${file}`
        const status = await _stat(filePath)
        if (status.isDirectory()) {
            let temp = []
            await _getFileNames(filePath, temp)
            result.push(temp)
        } else {
            result.push(file)
        }
    }
}

// 返回promise的readdir
function _readdir (path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                throw new Error(`读取文件夹: ${path} 出错`)
                reject()
            } else {
                resolve(files)
            }
        })
    })
}

// 返回promise的stat
function _stat (path) {
    return new Promise ((resolve, reject) => {
        fs.stat(path, (err, status) => {
            if (err) {
                throw new Error(`读取文件夹: ${path} 出错`)
                reject()
            } else {
                resolve(status)
                
            }
        })
    })
}

// 递归遍历文件夹下所有的文件
async function getFileNames (path) {
    let result = []
    await _getFileNames(path, result)
    return result
}

module.exports = {
    readFile,
    getFileNames
}