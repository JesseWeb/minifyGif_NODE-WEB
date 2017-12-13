let http = require('http')
let app = require('./app')
process.env.PORT = process.env.PORT || 3000
let server = http.createServer(app)
server.listen(process.env.PORT)

console.log('server listen to '+process.env.PORT)