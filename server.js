require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
const mongoClient = require("mongodb").MongoClient;
var config = require('config.json');
const obj_q = require ("./parser/file");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/quest', require('./controllers/api/quest.controller'));

// write question module
app.post("/write", function(req, res){
    mongoClient.connect(config.connectionString, function(err, client){
      let count=0;
      for (key in obj_q){
        client.db("test1").collection("Quest").insert(obj_q[key]);
        count++;
      }
        res.send(count.toString());                  
        client.close();
      });
  });

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});
// start server
var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});