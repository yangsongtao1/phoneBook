const mysql = require('mysql');

const config = require('../config/mysql.config.js')
let pool = mysql.createPool({
    user:config.database.USERNAME,
    password:config.database.PASSWORD,
    database:config.database.DATABASE,
    host:config.database.HOST,
    port:config.database.PORT
})

let query = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, fields) => {
                    if ( err )   reject( err )
                    else  resolve( fields )
                    connection.release();
                })
            }
        })
    })
}
module.exports = {query}