const router = require('koa-router')()
const token = require('../../token/token')
const md5 = require('../../lib/tools.js')
const { selectGroup } = require("../../model/userModel")
const { selectGroupPersonNumber, addGroup, delGroup, getGroupIdByUidAndName, getGroupByGroupName} = require("../../model/groupModel")
const { delGroupPhoneByGid, changePhoneGroup } = require("../../model/phoneListModel")

router.get('/grouplist', async (ctx) => {
    await  selectGroup([ctx.request.query.uid]).then(async res => {
        let i, personNumber
        for (i = 0; i < res.length; i++) {
            res[i].number = await searchGroupPersonNumber(res[i].id)
        }
        ctx.body = {
            code: 100,
            message: '请求成功',
            group: res
        }
    })
})

router.post('/addGroup', async (ctx) => {
    await getGroupByGroupName([ctx.request.body.uid, ctx.request.body.groupName]).then(async res => {
        console.log(res.length)
        if (res.length > 0) {
            ctx.body = {
                code: 113,
                message: "对不起已存在该分组"
            }
        } else {
            await addGroup([ctx.request.body.groupName, ctx.request.body.groupColor, ctx.request.body.uid]).then(async res => {
                if (res.affectedRows === 1) {
                    ctx.body = {
                        code: 100,
                        message: "添加成功"
                    }
                }
            })
        }
    })
})

router.post('/DelGroupAndPhone', async (ctx) => {
    await delGroupPhoneByGid([ctx.request.body.id])
    await delGroup([ctx.request.body.id]).then(async res => {
        if (res.affectedRows === 0) {
            ctx.body = {
                code: 104,
                message: "删除失败"
            }
        } else if(res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                message: "删除成功"
            }
        }
    })
})

router.post('/onlyDelGroup', async (ctx) => {
    let gid = await getGroupIdByUidAndGroupName('未分组', ctx.request.body.uid)
    await changePhoneGroup([gid, ctx.request.body.id])
    await delGroup([ctx.request.body.id]).then(async res => {
        if (res.affectedRows === 0) {
            ctx.body = {
                code: 101,
                message: "删除失败"
            }
        } else if(res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                message: "删除成功"
            }
        }
    })
})

let searchGroupPersonNumber = async function (id) {
    let peronNumber
    await selectGroupPersonNumber([id]).then(async res => {
        peronNumber = res.length
    })
    return peronNumber
}
let getGroupIdByUidAndGroupName = async function (name, uid) {
    let gid
    await getGroupIdByUidAndName([name, uid]).then(async res => {
        gid = res[0].id
    })
    return gid
}
module.exports = router
