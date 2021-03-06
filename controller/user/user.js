import query from '../../mysqlDB/mysqlConfig';
import BaseComponent from '../../util/baseComponent';

class User extends BaseComponent {
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.testToken = this.testToken.bind(this);
    }
    async login(req, res, next) {
        let username = req.body.username;
        let password = this.encryption(String(req.body.password));
        var sql = `SELECT * FROM base_user WHERE username = "${username}";`;
        if(username === '' || password === '') {
            res.json({
                code: 1400,
                msg: '用户名或密码不能为空！',
                data: null
            });
            return;
        }
        await query(sql).then(results => {
            if(results.length === 0) {
                res.json({
                    code: 1401,
                    msg: '用户不存在',
                    data: null
                });
            } else {
                if(results[0].password === password) {
                    res.json({
                        code: 0,
                        msg: '登录成功！',
                        data: results[0]
                    });
                } else {
                    res.json({
                        code: 1402,
                        msg: '密码错误！',
                        data: null
                    });
                }
            }
        });
    }
    async signUp(req, res, next) {
        let username = req.body.username;
        let password = this.encryption(String(req.body.password));
        let searchUserSql = `SELECT * FROM base_user WHERE username = "${username}";`;
        await query(searchUserSql).then(results => {
            let data = results;
            if(data.length > 0) {
                res.json({
                    code: 1400,
                    msg: "用户已存在！",
                    data: null
                });
            } else {
                let addUserSql = `insert into base_user (username, password) values ("${username}", "${password}");`;
                let token = this.creatToken(username);
                query(addUserSql).then(results => {
                    if(results.insertId >= 0) {
                        res.json({
                            code: 0,
                            msg: "用户注册成功！",
                            data: {
                                username: username,
                                token: token
                            }
                        }); 
                    } else {
                        res.json({
                            code: 1500,
                            msg: "用户注册失败！",
                            data: null
                        }); 
                    }
                });
            }
        });
    }
    async testToken(req, res, next) {
        let token = this.getRequestToken(req);
        let vertify = this.vertifyToken(token);
        // let vertify = this.decodeToken(token);
        if(vertify) {
            res.json({
                code: 0,
                data: {
                    decodedToken: vertify
                }
            })
        } else {
            res.json({
                code: 1500,
                msg: 'token无效，请重新登录'
            })
        }
    }
}

export default new User();