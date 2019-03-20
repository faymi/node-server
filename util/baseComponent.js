const jwt= require('jsonwebtoken');
import {tokenSecret} from '../config/defaults';

export default class BaseComponent {
    constructor() {

    }
    // 生成token
    creatToken(username) {
        //定义签名
        const secret = tokenSecret;
        //生成token
        const token = jwt.sign({
            name: username,
            timestamp: new Date().getTime()
        }, secret, {
            expiresIn:  5 * 60 //秒到期时间
        });
        return token;
    }
    vertifyToken(token) {
        // 解码 token (验证 secret 和检查有效期（exp）)
        jwt.verify(token, tokenSecret, function(err, decoded) {      
            if (err) {
                return false;  
            } else {
                return decoded;
            }
      });
    }
    decodeToken(token) {
        let decoded = jwt.decode(token)
        return decoded
    }
}