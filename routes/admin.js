var express = require('express');
var gen_box = require('../models/select_box');
var display_product = require('../models/product_table');
const { render } = require('ejs');
var router = express.Router();

/* GET home page. */
var session;
router.get('/', async function(req, res, next) {
  session = req.session;
  console.log(session.shop_id)
  if(session.user_id){
    let shop_id = session.shop_id;
    let username = session.user_id;
    let table = await display_product(shop_id,session);
    let box_string = await gen_box();
    res.render('admin', {title: 'Admin Page', name: username, select_box: box_string, table_string: table})
  }
  else{
    res.redirect('/login');
  }
});

router.post('/select_box', async function(req, res, next) {
  let shop_id = req.body.shop;
  username = req.session.user_id;
  let table = await display_product(shop_id,session);
  let box_string = await gen_box(shop_id);
  res.render('admin', { title: 'Admin Page', 
                        name: username, 
                        select_box: box_string, 
                        table_string: table});

});

module.exports = router;
