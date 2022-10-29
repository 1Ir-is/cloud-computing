const Pool = require('pg').Pool;
const pg_conn = new Pool (
    {
        user:'bsrcibtdzclgbk',
        password:'aa9b5f69ce006df64266a1c43ce2880a129429adae7db54b010982db76ef1781',
        host:'ec2-3-220-207-90.compute-1.amazonaws.com',
        database:'d3phlst5druklm',
        port:5432,
        ssl: {
            rejectUnauthorized: false
        },
    });

module.exports = pg_conn;