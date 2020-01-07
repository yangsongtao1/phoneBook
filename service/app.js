const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const login = require('./routes/login')
const register = require('./routes/user/register')
const grouplist = require('./routes/phonelist/grouplist')
const phonelist = require('./routes/phonelist/phonelist')
const userCenter = require('./routes/user/userCenter')
const forgetPw = require('./routes/user/forgetPw')
const notelist = require('./routes/notelist/notelist')

const { checkResquest } = require("./token/checkRequest") //对每次需要检测登陆的接口进行统一检测

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await checkResquest(ctx, next)
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(login.routes(), login.allowedMethods())
app.use(grouplist.routes(), grouplist.allowedMethods())
app.use(phonelist.routes(), phonelist.allowedMethods())
app.use(register.routes(), register.allowedMethods())
app.use(userCenter.routes(), userCenter.allowedMethods())
app.use(forgetPw.routes(), forgetPw.allowedMethods())
app.use(notelist.routes(), notelist.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
