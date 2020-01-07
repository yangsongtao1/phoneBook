const Email = require('../config/email')
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')

let Store = new Redis().client

const sendCode = async (ctx) => {
    console.log('senCode')
    console.log(ctx)
    let username = ctx.request.body.username
    console.log(ctx.request.body.username)
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')

    if (saveExpire && new Date().getTime() - saveExpire < 0) {
        ctx.body = {
            code: -1,
            msg: '验证码请求过于频繁,1分钟内1次'
        }
        return false
    }

    let transporter = nodeMailer.createTransport({
        host: Email.smtp.host,
        port: 587,
        secure: false,
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })
    let ko = {
        code: Email.smtp.code(),
        expire: Email.smtp.expire(),
        email: ctx.request.body.email,
        user: ctx.request.body.username
    }

    let mailOptions = {
        from: `"认证邮件" <${Email.smtp.user}>`,
        to: ko.email,
        subject:`《涛涛通讯录注册》`,
        html: `您在《涛涛通讯录》中注册,您的注册码是:${ko.code},如果不是本人操作请忽略`
    }
    await transporter.sendMail(mailOptions, (error,info) => {
        if (error) {
            return console.log('error')
        } else {
            let msgss = Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
        }
    })
    ctx.body = {
        code: 100,
        msg: '验证码已发送,可能存在延迟,有效期1分钟'
    }
}

const checkCode = async (ctx, code, username) => {
    if (code) {
        const saveCode = await Store.hget(`nodemail:${username}`, 'code')
        const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
        console.log(code, saveCode)
        if (code === saveCode) {
            if (new Date().getTime() - saveExpire > 0) {
                ctx.body = {
                    code: 109,
                    msg: '验证码已过期，请重新尝试'
                }
            } else {
                return true
            }
        } else {
            console.log('OK')
            ctx.body = {
                code: 110,
                msg: '请填写正确的验证码'
            }
        }
    } else {
        ctx.body = {
            code: 111,
            msg: '请填写验证码'
        }
    }
    return false
}

module.exports = {sendCode, checkCode}
