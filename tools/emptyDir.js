let fs = require('fs')
module.exports =  function (fileUrl) {
    var files = fs.readdirSync(fileUrl); //读取该文件夹

    files.forEach(function (file) {

        var stats = fs.statSync(fileUrl + '/' + file);

        if (stats.isDirectory()) {

            emptyDir(fileUrl + '/' + file);

        } else {
            fs.unlinkSync(fileUrl + '/' + file);
            console.log("删除文件" + fileUrl + '/' + file + "成功");
        }

    });

}