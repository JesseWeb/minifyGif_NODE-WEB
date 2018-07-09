const express = require('express')
const app = express()
const uploadGifRouter = require('./api/routers/uploadGif')
const userDownloadRouter  = require('./api/routers/userDownload')
const morgan = require('morgan')
const schedule = require('node-schedule');
const emptyDir = require('./tools/emptyDir')
const path = require('path')
const fs = require('fs')
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1]
rule.hour = 23
rule.minute = 45
var j = schedule.scheduleJob(rule, () => {
    emptyDir('product')
})
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// app.use(morgan('common',{stream: accessLogStream}))

app.all('/uploadGif', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.use('/uploadGif', uploadGifRouter)

app.use('/product',userDownloadRouter)
app.get('/',(req,res,next) => {
    let indexPath = path.resolve(__dirname,'./static/index.html')
    res.sendFile(indexPath)
})
app.use('/static',express.static('static'))
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app