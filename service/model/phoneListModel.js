const { query } = require("../lib/mysql")

let addPhoneList = (value) => {
    let _sql = "insert INTO phonelist set `name`=?, age=?, sex=?, phone=?, QQ=?, email=?, avator=?, mobile=?, address=?, remark=?, hobby=?, gid=?"
    return query(_sql, value)
}

let delGroupPhoneByGid = (value) => {
    let _sql = "delete from phonelist where gid=?"
    return query(_sql, value)
}

let changePhoneGroup = (value) => {
    let _sql = "update phonelist set gid=? where gid=?"
    return query(_sql, value)
}

let getPhoneListByGid = (value) => {
    let i
    let _sql = "select * from phonelist where "
    for(i = 0; i < value.length; i++) {
        if (i === value.length - 1) {
            _sql += "gid=?"
        } else {
            _sql += "gid=? or "
        }
    }
    return query(_sql, value)
}
let getPhoneListById = (value) => {
    let _sql = "select * from phonelist where id=?"
    return query(_sql, value)
}

let delPhoneListById = ( value) => {
    let _sql = "delete from phonelist where id=?"
    return query(_sql, value)
}
let updataPhonelistById = (value) => {
    let _sql = "update phonelist set `name`=?, age=?, sex=?, phone=?, QQ=?, email=?, avator=?, mobile=?, address=?, remark=?, hobby=?, gid=? where id=?"
    return query(_sql, value)
}

let getNoteListByName = (name, uid) => {
    let i
    let _sql = `select * from phonelist where (name like "%${name}%" or phone like "%${name}%" or address like "%${name}%" or mobile like "%${name}%" or remark like "%${name}%" or hobby like "%${name}%") and`
    for (i = 0; i < uid.length - 1; i++) {
        _sql += ` (gid=${uid[i]} or `
    }
    if (uid.length === 1) {
        _sql += ` gid=${uid[i]}`
    } else {
        _sql += `gid=${uid[i]})`
    }
    return query(_sql)
}
module.exports  = {delGroupPhoneByGid, changePhoneGroup, addPhoneList, getPhoneListByGid, getPhoneListById, delPhoneListById, updataPhonelistById, getNoteListByName}
