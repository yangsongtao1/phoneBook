const token = require('./token')

const checkResquest = async function (ctx, next) {
    console.log(ctx.url)
    if (ctx.url.indexOf('/login') >= 0 || ctx.url.indexOf('/confirmForget') >= 0 || ctx.url.indexOf('/verifyCode') >= 0 || ctx.url.indexOf('/forgetPw') >= 0
        || ctx.url.indexOf('/verify') >= 0 || ctx.url.indexOf('/register') >= 0)
    {
        await next()
    } else {
        console.log(ctx.url)
        let webToken = ctx.request.header.authorization;
        if (webToken) {
            //  获取到token
            console.log(webToken)
            let res = token.decrypt(webToken);  //解析token
            if (res && res.exp <= new Date() / 1000) { //进行时间对比
                ctx.body = {
                    message: 'token过期',
                    code: 102
                };
            } else if (res === null) {
                ctx.body = {
                    message: '无效Token',
                    code: 103
                };
            } else {
                await next()
            }
        } else{  // 没有取到token
            ctx.body = {
                msg:'没有token',
                code: 101
            }
        }
    }
}

module.exports = {checkResquest}
