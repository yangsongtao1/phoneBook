const router = require('koa-router')()
const md5 = require('../../lib/tools.js')

const {sendCode, checkCode} = require('../../lib/EmailCode')
const { getAllByEmail, changePwByEmail} = require("../../model/userModel")

router.post('/confirmForget', async (ctx) => {
    const {username, email, code} = ctx.request.body;
    console.log(username, email, code)
    if (await checkCode(ctx, code, username)) {
        ctx.body = {
            code: 100,
            msg: "验证通过"
        }
    }
})


router.post('/verifyCode', async (ctx,next)=> {
    let isVerift = false
    console.log(ctx.request.body)
    await getAllByEmail([ctx.request.body.email]).then(res => {
        console.log(res)
        if (res.length <= 0 || res[0].username !== ctx.request.body.username) {
            isVerift = true
        }
    })
    if (isVerift) {
        ctx.body = {
            code: 109,
            msg: '该邮箱不存在或者邮箱和账号不匹配'
        }
        return false
    }
    await sendCode(ctx)
});

router.post('/forgetPw', async (ctx) => {
    await getAllByEmail([ctx.request.body.email]).then( async res => {
        let password
        await md5.MD5(ctx.request.body.password, res[0].username).then( async res => {
            password = res
        })
        await changePwByEmail([password, ctx.request.body.email]).then(async res => {
            if (res.affectedRows === 1) {
                ctx.body = {
                    code: 100,
                    msg: '修改成功'
                }
            }
        })
    })
})

module.exports = router
