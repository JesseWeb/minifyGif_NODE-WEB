let http = require('http')
let app = require('./app')
let port = 3000
let server = http.createServer(app)
server.listen(port)

console.log('server listen to '+port)