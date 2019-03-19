import query from '../../mysqlDB/mysqlConfig';

class User {
    constructor() {

    }
    async login(req, res, next) {
        console.log(req.body);
        var sql = `SELECT * FROM base_user WHERE username = "${req.body.username}" and password = "${req.body.password}";`;
        console.log(sql);
        await query(sql).then(results => {
            var json = JSON.stringify(results);
            res.json(JSON.parse(json)); 
        });
    }}

export default new User();