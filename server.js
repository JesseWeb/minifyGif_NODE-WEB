let http = require('http')
let app = require('./app')
let port = process.env.PORT || 3000
const readline = require('readline');
let server = http.createServer(app)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function checkNumber(theObj) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
      return true;
    }
    return false;
  }
rl.question('你认为应该监听哪个端口好(默认80)？', (answer) => {
    if(answer===''){
        answer = 80
    }
    // 对答案进行处理
    if(!checkNumber(answer)){
        console.log("别给我搞事 ,得输入数字哦")
        process.exit(0)
    }
    server.listen(answer)
    console.log('server listen to ' + answer)
    rl.close();
});
