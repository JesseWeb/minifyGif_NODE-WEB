let http = require('http')
let app = require('./app')
let port = process.env.PORT || 3000
var os = require('os');
var platform = os.platform();
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
let win32 = () => {
    rl.question('你认为应该监听哪个端口好(默认80)？', (answer) => {
        if (answer === '') {
            answer = 80
        }
        // 对答案进行处理
        if (!checkNumber(answer)) {
            console.log("别给我搞事 ,得输入数字哦")
            win32()
        }else{
            server.listen(answer)
            console.log('server listen to ' + answer)
            rl.close();
        }
       
    });
}
let other = () => {
    console.log('检测到非windos系统,无法监听1024以下端口,请自行使用nginx做转发处理')
    rl.question('你认为应该监听哪个端口好(默认3000)？', (answer) => {
        if (answer === '') {
            answer = 3000
        }
        if (!checkNumber(answer)) {
            console.log("别给我搞事 ,得输入数字哦")
            process.exit(0)
        }
        if (answer <= 1024) {
            console.log("是不是搞事?告诉你不能监听1024以下的端口了!!!")
            console.log('---------------------------------------------------------')
            console.log('再给你一次机会')
            other()
        } else {
            server.listen(answer)
            console.log('server listen to ' + answer)
            rl.close();
        }
    });
}
if (platform != 'win32') {
    other()
} else {
    win32()
}


