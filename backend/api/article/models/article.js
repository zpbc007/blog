'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
const shell = require('shelljs')

const frontedDir = '/root/repo/blog/frontend'
const nginxDistDir = '/var/www/callback'

let seed = 0
const genId = () => {
    return `${seed++}-${Date.now()}`
}

// 构建任务
function build() {
    // 跳转到项目目录
    if (shell.pwd().stdout !== frontedDir) {
        shell.cd(frontedDir)
    }

    // 使用 yarn kill 不掉 child
    const child = shell.exec('npm run generate', {async: true})
    const donePromise = new Promise(resolve => {
        child.once('exit', (code, signal) => {
            // 清空目录
            shell.rm('-rf', `${nginxDistDir}/*`)
            // 添加新文件
            shell.mv('./dist/*', nginxDistDir)
            resolve({code, signal})
        })
    })

    return {
        cancel: () => child.kill('SIGINT'),
        donePromise,
        id: genId()
    }
}

function createBuildJobQueue() {
    // 之前的任务
    let preJob = null

    return {
        createNewJob() {
            // 取消之前的任务
            if (preJob) {
                console.log('cancel: ', preJob.id)
                preJob.cancel()
            }

            preJob = build()
            console.log('start: ', preJob.id)
            const id = preJob.id
            preJob.donePromise.then(() => {
                // 任务完成，清理
                if (preJob && preJob.id === id) {
                    console.log('finish: ', preJob.id)
                    preJob = null
                }
            })

            return preJob.donePromise
        }
    }
}

const {createNewJob} = createBuildJobQueue()
module.exports = {
    lifecycles: {
        async afterUpdate(doc, params, data) {
            // 有文档发布后，重新构建
            if (data && data.hasOwnProperty && data.hasOwnProperty('published_at')) {
                createNewJob()
            }
        },
    }
};
