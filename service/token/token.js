const jwt = require('jsonwebtoken');
const serect = 'token';  //生成token所需要的密钥

let token = {
    addToken: (userInfo) => {
        const token = jwt.sign({
            user: userInfo.user,
            id: userInfo.id
        }, serect, {expiresIn: '1h'});
        return token;
    },
    decrypt: (tokens) => {
        if (tokens) {
            let token = tokens.split(' ')[1];
            let decoded = jwt.decode(token, serect);
            return decoded;
        }
    }
}

exports = module.exports = token;
