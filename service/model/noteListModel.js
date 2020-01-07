const { query } = require("../lib/mysql")

let addNoteList = (value) => {
    let _sql = "insert INTO notelist set title=?, time=?, type=?, content=?, uid=?"
    return query(_sql, value)
}
let selectNoteListByUid = (value) => {
    let _sql = "select * from notelist where uid=?"
    return query(_sql, value)
}

let deleteNoteById = (value) => {
    let _sql = "delete from notelist where id=?"
    return query(_sql, value)
}

let unpdateNoteById = (value) => {
    console.log(value)
    let _sql = "update notelist set title=?, time=?, type=?, content=? where id=?"
    return query(_sql, value)
}

let getNoteNumberByType = () => {
    let _sql = "select type as 类型, count(type) as 人数 from notelist group by type"
    return query(_sql)
}

let getNoteListByType = (value) => {
    let _sql = "select * from notelist where type=?"
    return query(_sql, value)
}

let getNoteListByName = (name, type) => {
    let _sql
    if (type === 'all') {
        _sql = `select * from notelist where (title like "%${name}%" or content like "%${name}%")`
    } else {
        _sql = `select * from notelist where (title like "%${name}%" or content like "%${name}%") and type='${type}'`
    }
    return query(_sql)
}
module.exports  = {addNoteList, selectNoteListByUid, deleteNoteById, unpdateNoteById, getNoteNumberByType, getNoteListByType, getNoteListByName}
