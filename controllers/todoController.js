var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var url = 'mongodb+srv://root:root@ama-ylzfp.mongodb.net/test?retryWrites=true'; //url of DB
var urlencodedParser = bodyParser.urlencoded({
    extented: false
});

module.exports = function (app) {

    app.get('/todo', function (req, res) {
        getData(function (data) {
            res.render('todo', {
                todos: data
            });
        });
    });

    app.post('/todo', urlencodedParser, function (req, res) {
       console.log(req.body.item);
        insertData(req.body);
        getData(function (result) {
            res.render('todo', {
                todos: result
            });
            console.log(result);
        });
    });

    app.delete('/todo/:item', function (req, res) {
       var newstr = req.params.item.replace("-"," ");
        console.log(newstr);
        deleteData(newstr);
        getData(function (result) {
            res.render('todo', {
                todos: result
            });
        });
    });

};


//Database functions

//Use for insert data into DB
function insertData(data) {
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            throw err;
        } else {
            var dbo = db.db("todo");
            dbo.collection("data").insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        }

    });
}

//Use for get data from DB
function getData(callback) {
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("todo");
        var query = {};
        dbo.collection("data").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    });
};

//Use for delte data from DB
function deleteData(item) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("todo");
        dbo.collection('data').deleteOne({
            "item": item
        }, function (err, result) {
            if (err) throw err;
            db.close();
            console.log('Item deleted');
        });
    });
}