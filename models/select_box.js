var pg_conn = require('./pg_config');
async function gen_box(selectValue=-1){
  // Query DB to get the table data 
  let shops_query = `SELECT shops.id, shops.name, users.role FROM shops 
                      JOIN users ON shops.id = users.shop_id`;
  const data = await pg_conn.query(shops_query);
  let box_string = `
    <form action="/admin/select_box" method="post">
      <label for="shop">Choose a shop:</label>
        <select name="shop" id="shop">
            <option value=0 ${selectValue==-1?` selected`:''}>All shops</option>`;
  let select_items = data.rowCount;
  for (let i = 0; i < select_items; i++) {
    if (data.rows[i].role != "director") {
      box_string += `<option value=${data.rows[i].id} ${selectValue==data.rows[i].id?` selected`:''}>${data.rows[i].name}</option>`;
    }
  }
  box_string += `</select>
    <input type="submit" value="view">
  </form>`;
  return box_string;
}
module.exports = gen_box;