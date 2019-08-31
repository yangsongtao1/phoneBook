const { query } = require("../lib/mysql")


let addGroup = (value) => {
    let _sql = "insert INTO listgroup set groupName=?, groupColor=?, uid=?"
    return query(_sql, value)
}
// 查看每个组有多少人
let selectGroupPersonNumber =  (value) => {
    let _sql = "select * from phonelist where gid=?"
    return query(_sql, value)
}
// 删除分组不删除分组的人(联系人统一放到未分组)
let delGroup = (value) => {
    let _sql = "delete from listgroup where id=?"
    return query(_sql, value)
}
let getGroupIdByUidAndName = (value) => {
    let _sql = "select id from listgroup where groupName=? and uid=?"
    return query(_sql, value)
}

let getGroupByGid = (value) => {
    let _sql = "select * from listgroup where id=?"
    return query(_sql, value)
}

let getGroupByGroupName = (value) => {
    let _sql = "select * from listgroup where uid=? and groupName=?"
    return query(_sql, value)
}
module.exports  = {selectGroupPersonNumber, addGroup, delGroup, getGroupIdByUidAndName, getGroupByGid, getGroupByGroupName}
