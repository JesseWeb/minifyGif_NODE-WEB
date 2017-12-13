let express = require('express')
let router = express.Router()
let miniGif = require('../../mini_gif')
let fs = require('fs')
let path = require('path')
let port = process.env.PORT
const formidable = require('formidable')
let portStr = process.env.PORT!=80?':'+process.env.PORT:''
router.post('/', (req, res, next) => {
    res.header({
        "content-type": "application/json",
        "charset": 'urf8',
        "Access-Control-Allow-Origin": "*"
    })
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.status(415)
            res.json({
                code: 0001,
                message: "传入参数解析失败",
                data: 'error'
            })
        } else {
            let gap = fields.gap
            let quality = fields.quality
            let size = fields.size
            miniGif({
                gap,
                quality,
                files,
                size
            }).then(({paths, code}) => {
                let arr = []
                paths.forEach(obj => {
                    arr.push({
                        url:'http://'+req.hostname+portStr+'/product/'+obj,
                        size:fs.statSync('./product/'+obj).size
                    })
                });

                if (code == 0) {
                    res.status(200)
                    res.json({
                        code: 0,
                        message: "success",
                        data: {
                            imageUrls:arr
                        }
                    })
                }
            }, (err, code) => {
                if (code == 1) {
                    res.status(415)
                    res.json({
                        code: 0002,
                        message: "图片生成失败",
                        data: 'error'
                    })
                } else if (code == -1) {
                    res.status(415)
                    res.json({
                        code: 0003,
                        message: "图片解析失败",
                        data: 'error'
                    })
                }
            })
        }
    });
})

module.exports = router