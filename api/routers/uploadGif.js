let express = require('express')
let router = express.Router()
let miniGif = require('../../mini_gif')
let fs = require('fs')
let path = require('path')
let port = process.env.PORT
const formidable = require('formidable')
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
            }).then((result) => {
                let arr = []
                result.forEach(obj => {
                    arr.push({
                        url: '/product/' + obj.url,
                        size: fs.statSync('./product/' + obj.url).size,
                        name: obj.name,
                        originSize: obj.originSize
                    })
                });
                res.status(200)
                res.json({
                    code: 0,
                    message: "success",
                    data: {
                        imageUrls: arr
                    }
                })
            })
        }
    });
})

module.exports = router