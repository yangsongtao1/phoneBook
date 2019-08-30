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
module.exports  = {delGroupPhoneByGid, changePhoneGroup, addPhoneList, getPhoneListByGid, getPhoneListById, delPhoneListById, updataPhonelistById}
