const router = require('koa-router')()
const token = require('../../token/token')
const md5 = require('../../lib/tools.js')

const { addPhoneList, getPhoneListByGid, getPhoneListById, delPhoneListById, updataPhonelistById } = require("../../model/phoneListModel")
const { getGroupByGid } = require("../../model/groupModel")
router.post('/addContact', async (ctx, next) => {
    if (ctx.request.body.avator === '') {
        ctx.request.body.avator = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2195235480,80026129&fm=26&gp=0.jpg'
    }
    await addPhoneList([ctx.request.body.name, ctx.request.body.age,
        ctx.request.body.sex, ctx.request.body.phone,
        ctx.request.body.QQ, ctx.request.body.email,
        ctx.request.body.avator, ctx.request.body.mobile,
        ctx.request.body.address, ctx.request.body.desc,
        ctx.request.body.hobby, ctx.request.body.gid]).then(async res => {
        if (res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                message: "添加成功"
            }
        }
    })
})

router.get('/getPhoneList', async (ctx) => {
    let temp = await ctx.request.query.gids.split(',').map( (item) => {
        return parseInt(item)
    })
    await getPhoneListByGid(temp).then( async res => {
        let result = []
        let temp = {}
        let i, groupName, groupColor
        for (i = 0; i < res.length; i++) {
            temp = {}
            temp.id = res[i].id
            temp.name = res[i].name
            temp.mobile = res[i].mobile
            temp.QQ = res[i].QQ
            temp.avator = res[i].avator
            temp.address = res[i].address
            await getGroupByGid(res[i].gid).then( async res => {
                groupName = res[0].groupName
                groupColor = res[0].groupColor
            })
            temp.groupName = groupName
            temp.groupColor = groupColor
            result.push(temp)
        }
        ctx.body = {
            code: 100,
            msg: '请求成功',
            lists: result
        }
    })
})

router.get('/getPhoneListById', async (ctx) => {
    await getPhoneListById([ctx.request.query.id]).then( async res => {
        let groupName
        await getGroupByGid([res[0].gid]).then(res => {
            groupName = res[0].groupName
        })
        res[0].groupName = groupName
        ctx.body = {
            code: 100,
            msg: '请求成功',
            list: res[0]
        }
    })
})

router.post('/delPhoneListByID', async (ctx) => {
    await delPhoneListById([ctx.request.body.id]).then( async res => {
        ctx.body = {
            code: 100,
            msg: "删除成功"
        }
    })
})

router.post('/updataPhonelistById', async (ctx) => {
    await updataPhonelistById([ctx.request.body.name, ctx.request.body.age,
        ctx.request.body.sex, ctx.request.body.phone,
        ctx.request.body.QQ, ctx.request.body.email,
        ctx.request.body.avator, ctx.request.body.mobile,
        ctx.request.body.address, ctx.request.body.desc,
        ctx.request.body.hobby, ctx.request.body.gid, ctx.request.body.id]).then( res => {
        if (res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                msg: '修改成功'
            }
        }
    })
})
module.exports = router
