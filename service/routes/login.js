const router = require('koa-router')()
const addToken = require('../token/token')
const md5 = require('../lib/tools.js');
const { selectUserName, selectGroup } = require("../model/userModel")

router.post('/login', async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password

    await selectUserName([username]).then(async res => {
        if (res.length === 0) {
            ctx.body = {
                code: 104,
                message: '对不起账号不存在'
            }
        } else {
            let sqlPassword
            await md5.MD5(password, username).then( res => {
                sqlPassword = res
            })
            console.log(res[0].password)
            if (sqlPassword === res[0].password) {
                const token = addToken.addToken({user: res[0].name, id: res[0].id})  //主要是这里 生成token
                ctx.body = {
                    code: 100,
                    message: '登陆成功',
                    user: res[0],
                    token
                }
            } else {
                ctx.body = {
                    code: 105,
                    message: '对不起密码错误'
                }
            }
        }
    })
})

module.exports = router
