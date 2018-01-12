/*
    code:-1 表示图片解析失败
    code: 1 表示图片生成失败
*/
var fs = require('fs'),
    gm = require('gm'),
    productDir = './product',
    path = require('path');
const childProcess = require('child_process')
var crypto = require('crypto');
const spawn = childProcess.spawn
if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir)
}
module.exports = async({
    files,
    gap,
    quality,
    size
}) => {
    let objectLength = Object.keys(files).length
    let result = []
    for (const file in files) {
        if (files.hasOwnProperty(file)) {
            let obj = files[file]
            result.push(await processImage(obj, {
                files,
                gap,
                quality,
                size
            }))
        }
    }
    return result
}

function processImage(obj, {
    files,
    gap,
    quality,
    size
}) {
    return new Promise((resolve, reject) => {
        let image = gm(obj.path)
        let outputFileName = 'mini-' + obj.name
        let originSize = obj.size
        let outputFilePath = productDir + outputFileName
        image.identify((err, val) => {
            if (!val.Scene) {
                reject(err)
                return
            }
            let frames_count = val.Scene[0].replace(/\d* of /, '') * 1
            let delayList = [];
            let totaldelay = 0
            if (val.Delay != undefined) {
                let i
                for (i = 0; i < val.Delay.length; i++) {
                    delayList[i] = val.Delay[i].replace(/x\d*/, '') * 1
                    totaldelay += delayList[i]
                }
                for (; i < val.Scene.length; i++) {
                    delayList[i] = 8
                    totaldelay += delayList[i]
                }
            } else {
                for (let i = 0; i < val.Scene.length; i++) {
                    delayList[i] = 8
                    totaldelay += delayList[i]
                }
            }
            let totalFrame = parseInt(frames_count / gap)
            //判断是否速度过慢，需要进行归一加速处理
            if (totaldelay / totalFrame > 20) {
                let scale = (totalFrame * 1.0 * 20) / totaldelay
                for (let i = 0; i < delayList.length; i++) {
                    delayList[i] = parseInt(delayList[i] * scale)
                }
            }
            let params = []
            params.push("--unoptimize")
            params.push(obj.path)
            params.push("--colors=" + (val.color * quality / 100).toFixed(0))

            var tempdelay = delayList[0]
            for (let i = 1; i < frames_count; i++) {
                if (i % gap == 0) {
                    params.push("-d" + tempdelay)
                    params.push("#" + (i - gap))
                    tempdelay = 0
                }
                tempdelay += delayList[i]
            }
            params.push("--optimize=3")
            params.push("--resize=" + size)
            params.push("-o")
            var md5 = crypto.createHash('md5');
            var hash = md5.update(String(new Date().getTime())).digest('hex')
            params.push(productDir + '/' + hash + outputFileName)
            paths={
                url: hash + outputFileName,
                name: obj.name,
                originSize,
                code:0
            }
            let childProcess = spawn("gifsicle", params, {
                stdio: 'inherit'
            })
            childProcess.on('exit', (code) => {
                resolve(paths)
            })
        })
    })

}