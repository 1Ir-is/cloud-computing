var pg_conn = require("./pg_config");

async function authen(user, pass)
{   
    let authenticated = false;
    let shop_id;
    let role;
    const auth_query = 
    {
        text: 'SELECT * FROM users WHERE name = $1 AND password = $2',
        values: [user, pass]
    };
    var query_data = await pg_conn.query(auth_query);
    if (query_data.rowCount==1)
    {
        authenticated = true;
        shop_id = query_data.rows[0].shop_id;
        role = query_data.rows[0].role;
    }
    return [authenticated, shop_id, role];
}
module.exports = authen;