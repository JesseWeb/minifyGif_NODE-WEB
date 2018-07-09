let http = require('http')
let app = require('./app')
let port = process.env.PORT || 3000
let server = http.createServer(app)
server.listen(port)
server.addListener('listening',(params) => {
    console.log('server listening port: '+port)
})

