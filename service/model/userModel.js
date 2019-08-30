const { query } = require("../lib/mysql")

let selectUserName =  (value) => {
    let _sql = "select * from user where username=?"
    return query(_sql, value)
}
let selectUserID =  (value) => {
    let _sql = "select * from user where id=?"
    return query(_sql, value)
}
let insertUser = (value) => {
    let _sql = "insert INTO user set username=?, password=?, email=?"
    console.log(value)
    return query(_sql, value)
}
let selectGroup = (value) => {
    let _sql = "select * from listgroup where uid=?"
    return query(_sql, value)
}
let insertDefaultGroup = (value) => {
    let _sql = "insert INTO listgroup set groupName=?, groupColor=?, uid=?"
    return query(_sql, value)
}

let changePw = (value) => {
    let _sql = "update user set password=? where id=?"
    return query(_sql, value)
}

let checkPw = (value) => {
    let _sql = "select password,username from user where id=?"
    return query(_sql, value)
}

let getAllByEmail = (value) => {
    let _sql ="select * from user where email=?"
    return query(_sql, value)
}

let changeEmailById = (value) => {
    let _sql = "update user set email=? where id=?"
    return query(_sql, value)
}

let changePwByEmail = (value) => {
    let _sql = "update user set password=? where email=?"
    return query(_sql, value)
}
module.exports  = {selectUserID, selectUserName, insertUser, selectGroup, insertDefaultGroup, checkPw, changePw, getAllByEmail, changeEmailById, changePwByEmail}
