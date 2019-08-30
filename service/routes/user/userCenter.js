const router = require('koa-router')()
const md5 = require('../../lib/tools.js')

const {sendCode, checkCode} = require('../../lib/EmailCode')
const {checkPw, changePw, changeEmailById, selectUserID, getAllByEmail } = require("../../model/userModel")

router.post('/changeEmail', async (ctx) => {
    const {username, password, email, code} = ctx.request.body;
    if (await checkCode(ctx, code, username)) {
        await changeEmailById([ctx.request.body.email, ctx.request.body.id]).then( async res => {
            if (res.affectedRows === 1) {
                ctx.body = {
                    code: 100,
                    msg: "修改成功"
                }
            }
        })
    }
})

router.post('/checkedPw', async (ctx) => {
    await checkPw([ctx.request.body.id]).then( async res => {
        let password, newPassword
        await md5.MD5(ctx.request.body.oldpassword, res[0].username).then( async res => {
            password = res
        })
        if (password === res[0].password) {
            await md5.MD5(ctx.request.body.newPassword, res[0].username).then( async res => {
                newPassword = res
            })
            await changePw([newPassword, ctx.request.body.id]).then(async res => {
                if (res.affectedRows === 1) {
                    ctx.body = {
                        code: 100,
                        msg: '修改成功'
                    }
                }
            })
        } else {
            ctx.body = {
                code: 106,
                msg: "对不起原密码错误"
            }
        }
    })
})

router.get('/getUserEamil', async (ctx) => {
    await selectUserID([ctx.request.query.id]).then( async res => {
        if (res.length >= 1) {
            ctx.body = {
                code: 100,
                msg: "查找成功",
                data: res[0].email
            }
        } else {
            ctx.body = {
                code: 107,
                msg: "查找错误"
            }
        }
    })
})

router.post('/chengeEmailVerify', async (ctx,next)=> {
    let isVerift = false
    await getAllByEmail([ctx.request.body.email]).then(res => {
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
