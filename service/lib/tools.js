const md5 = require('md5')

exports.MD5 = function(val,solt){
    return new Promise((resolve, reject)=>{
        var passSolt = md5(md5(val)+solt);
        resolve(passSolt);
    })
}