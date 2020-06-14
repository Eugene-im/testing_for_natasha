var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Quest');

var service2 = {};
var num = "5";

service2.getByNum = getByNum;
service2.getAll = getAll;

module.exports = service2;

function getByNum(num) {
    var deferred = Q.defer();
    db.quest.find({num: num});
    console.log(db.quest.find({num: num}))
    return deferred.promise;
}

function getAll() {
    mongoClient.connect(config.database, function(err, client){
        client.db("test1").collection("Quest").find({}).toArray(function(err, quest){
            res.send(quest)
            client.close();
        });
    });
}