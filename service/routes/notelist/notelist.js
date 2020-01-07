const router = require('koa-router')()
const { addNoteList, selectNoteListByUid, deleteNoteById, unpdateNoteById, getNoteNumberByType, getNoteListByType, getNoteListByName } = require("../../model/noteListModel")

router.post('/addNote', async (ctx) => {
    await  addNoteList([ctx.request.body.title, ctx.request.body.time, ctx.request.body.type, ctx.request.body.content, ctx.request.body.uid]).then(async res => {
        if (res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                msg: '添加成功',
            }
        }
    })
})

router.get('/getNoteList', async (ctx) => {
    console.log(ctx.request.query)
    await selectNoteListByUid([ctx.request.query.uid]).then( res => {
        console.log(res)
        if (res.length >= 0) {
            ctx.body = {
                code: 100,
                msg: '请求成功',
                lists: res
            }
        }
    })
})

router.post('/deleteNote', async (ctx) => {
    console.log(ctx.request.body)
    await deleteNoteById([ctx.request.body.id]).then( res => {
        if (res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                msg: '删除成功'
            }
        }
    })
})
router.post('/updateNote', async (ctx) => {
    await unpdateNoteById([ctx.request.body.title, ctx.request.body.time, ctx.request.body.type, ctx.request.body.content, ctx.request.body.id]).then( res => {
        if (res.affectedRows === 1) {
            ctx.body = {
                code: 100,
                msg: '修改成功'
            }
        }
    })
})

router.get('/getNoteNumberByType', async (ctx) => {
    await getNoteNumberByType().then( res => {
        if (JSON.stringify(res) !== '{}') {
            ctx.body = {
                code: 100,
                msg: '查询成功',
                data: res
            }
        }
    })
})

router.post('/getNoteListByType', async (ctx) => {
    await getNoteListByType([ctx.request.body.type]).then( res => {
        if (res.length >= 0) {
            ctx.body = {
                code: 100,
                msg: '请求成功',
                lists: res,
                length: res.length
            }
        }
    })
})

router.post('/getNoteListByName', async (ctx) => {
    console.log(ctx.request.body.name, ctx.request.body.name, ctx.request.body.type)
    await getNoteListByName(ctx.request.body.name, ctx.request.body.type).then( res => {
        ctx.body = {
            code: 100,
            msg: '查询成功',
            lists: res
        }
    })
})
module.exports = router
