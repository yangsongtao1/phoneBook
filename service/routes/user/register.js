const router = require('koa-router')()
const md5 = require('../../lib/tools.js')

const {sendCode, checkCode} = require('../../lib/EmailCode')
const { insertUser, insertDefaultGroup, getAllByEmail} = require("../../model/userModel")

router.post('/register', async (ctx) => {
    const {username, password, email, code} = ctx.request.body;
    if (await checkCode(ctx, code, username)) {
        let mdPassword
        await md5.MD5(password, username).then( res => {
            mdPassword = res
        })
        await insertUser([username, mdPassword, email]).then(async res => {
            if (res.affectedRows === 1) {
                await insertDefaultGroup(['未分组', '#00C7FF', res.insertId]).then( res => {
                    if (res.affectedRows === 1) {
                        ctx.body = {
                            code: 100,
                            message: "添加成功"
                        }
                    }
                })
            } else {
                ctx.body = {
                    code: 101,
                    message: "添加失败"
                }
            }
        })
    }
})

router.post('/verify', async (ctx,next)=> {
    let isVerift = false
    await getAllByEmail([ctx.request.body.email]).then(res => {
        console.log(res)
        if (res.length > 0) {
            isVerift = true
        }
    })
    if (isVerift) {
        ctx.body = {
            code: 108,
            msg: '该邮箱已被注册'
        }
        return false
    }
    await sendCode(ctx)
});


module.exports = router
