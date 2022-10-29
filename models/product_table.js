var pg_conn = require('./pg_config');
// Define a function to display products table for a shop
async function display_products(shop_id,session){
    // Query DB to get the table data 
    console.log(session.shop_id);
    var products_query;
    if (shop_id==0){
        products_query ='SELECT * FROM products ORDER BY id ASC ';
        }
    else{
        products_query = {
            text: 'SELECT * FROM products WHERE shop_id=$1 ORDER BY id ASC',
            values: [shop_id]
        }
    }
    const data = await pg_conn.query(products_query);
    // pg_conn.end();
    // init the table_string, with the table tag
    let table_string = `
    <style>
        table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        }
        .insert-button {
        background-color: #4dff00;
        }
        .edit-button {
        padding-left: 4px;
        background-color: #e8ff00;
        }
        .delete-button {
        background-color: #ff0032;
        }
        td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        }
        tr:nth-child(even) {
        background-color: #dddddd;
        }
        .heading {
            font-weight: bold;
            text-align: center;
            font-size: 40px;
            margin-bottom: 20px;
            margin-top: 20px;
            color: blue;
        }
        .table {
            margin-left: 50px;
            margin-right: 50px;
        }

        </style>
        </head>
        <body>
        <h2 class="heading">Table products</h2>
        <table class="table">
    <tr>`;
    //display all headers of table
    let num_fields = data.fields.length;
    for (let i=0; i<num_fields; i++) {
        //if shop owner then don't need shop_ID
        if(session.shop_id!=0 && data.fields[i].name != 'shop_id' )
        {
            table_string += `<th>${data.fields[i].name}</th>`;
        }
        if(session.shop_id==0){
            table_string += `<th>${data.fields[i].name}</th>`;
        }
    }

    if(session.shop_id !=0){
        table_string += `<th>actions</th>`
    }
    
    table_string += `</tr>`;
    //display all rows of table
    let  num_rows = data.rowCount;
    console.log("Num rows: " + num_rows)
    for (let i=0; i<num_rows; i++) {
        table_string += `<form action="/users/crud" method="post">
                        <tr>`;
        for (let j=0; j<num_fields; j++) {
            let field_name = data.fields[j].name
            let cell = data.rows[i][field_name];  
            if(session.shop_id!=0 && field_name != 'shop_id' )
            {
                table_string += `<td><input type="text" name= ${field_name} value=${cell}></td>`;
            }
            if(session.shop_id==0){
                table_string += `<td>${cell}</td>`;
            }
            
        }
        //since only shop owners can input new data then the butons should only on their side
        if(session.shop_id!=0){
            table_string += 
            `<td>
            <button type="submit" name='crud' 
                class="bg-sky-900 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded" value='update'>Update</button>
            <button type="submit" name='crud' 
                class="bg-violet-900 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded"
                value='delete'>Delete</button>
        </td>
            </tr></form>`
        } 
    }
    //since only shop owner can add product, director does not need it
    if(session.shop_id!=0){
        const temp = await pg_conn.query('SELECT * FROM products ORDER BY id DESC');
        let tempName = temp.fields[0].name;
        last_id = temp.rows[0][tempName];
        console.log(last_id);
        // Add an empty row and insert button at the end of row
        table_string += `<tr><form action="/users/crud" method="post">`
        for (let j=0; j<num_fields; j++) {
            let field_name = data.fields[j].name

           // console.log(field_name);
            if(field_name!='shop_id'){
                //automatic id
                if(field_name=='id'){
                    table_string += `<td><input type="text" name= ${field_name} value = ${last_id+1}></td>`;
                }
                else{

                    table_string += `<td><input type="text" name= ${field_name} ></td>`;
                }
            }
        }
        table_string += 
        `<td> 
        <button type="submit" 
        class="bg-rose-900 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded"
            name='crud' 
            value='insert'>Insert</button>
        </td>`
        table_string += '</tr></form>';
    }        
    table_string += '</table>'
    // console.log("DATA: -->")
    // console.log(data)
    // console.log(table_string)
    return table_string;
    
}

module.exports = display_products;
