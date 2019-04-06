var express = require('express');
var todocontroller = require('./controllers/todocontroller');

var app = express();

//set up template engine 
app.set('view engine' , 'ejs');

//static files 
app.use(express.static('./public'));

//fire controllers
todocontroller(app);

//listen to port
app.listen(22);
console.log('you are listining to port 22');