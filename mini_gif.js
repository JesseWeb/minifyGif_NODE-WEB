/*
    code:-1 表示图片解析失败
    code: 1 表示图片生成失败
*/
var fs = require('fs'),
    gm = require('gm'),
    productDir = 'product'
const childProcess = require('child_process')
var crypto = require('crypto');
const spawn = childProcess.spawn
if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir)
}
module.exports = ({
    files,
    gap,
    quality,
    size
}) => {
    return new Promise((resolve, reject) => {
        let file = files
        let objectLength = Object.keys(files).length
        let processCount = objectLength
        let count = 0
        let outputPaths = []
        let paths = []
        for (const file in files) {
            if (files.hasOwnProperty(file)) {
                let obj = files[file]
                let outputFileName = 'mini-' + obj.name
                let outputFilePath = productDir + outputFileName
                let image = gm(obj.path)
                image.identify((err, val) => {
                    if (!val.Scene) {
                        reject(err, -1)
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
                    params.push("--colors=" + quality)
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
                    params.push("--resize="+size)
                    params.push("-o")
                    var md5 = crypto.createHash('md5');
                    var hash = md5.update(String(new Date().getTime())).digest('hex')
                    params.push(productDir + '/' + hash+outputFileName)
                    paths.push(hash+outputFileName)
                    let childProcess = spawn("gifsicle", params, {
                        stdio: 'inherit'
                    })
                    childProcess.on('exit', (code) => {
                        processCount--
                        if (processCount == 0) {
                            resolve({
                                paths,
                                code
                            })
                        }
                    })
                })
            }
        }


    })
}