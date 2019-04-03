const jwt= require('jsonwebtoken');
import crypto from 'crypto';
import {tokenSecret} from '../config/defaults';

export default class BaseComponent {
    constructor() {

    }
    // MD5编码加密
    encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
    }
    // 获取请求中的token
    getRequestToken(req) {
        // authorization 校验时，请求时格式为 {authorization: 'Bearer token'}
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.body && req.body.token) {
            return req.body.token;
        }
        return null;
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
            expiresIn:  '1h' //秒到期时间
        });
        return token;
    }
    // 解码 token (验证 secret 和检查有效期（exp）)
    vertifyToken(token) {
        let results = null;
        jwt.verify(token, tokenSecret, function(err, decoded) {
            if (err) {
                console.log(err);
            } else {
                results = decoded;
            }
        });
        return results;
    }
    // 解密token
    decodeToken(token) {
        let decoded = jwt.decode(token)
        return decoded
    }
}