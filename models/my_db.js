var MongoClient = require('mongodb').MongoClient,
assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/bysjglxt';

//

// Use connect method to connect to the server
function _OpenDB (callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        // console.log("Connected correctly to server");
        callback(db)
    });
}
init();

function init(){
    //对数据库进行一个初始化
    _OpenDB(function(db){
        db.collection('users').createIndex(
            { "username": 1},
            null,
            function(err, results) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("索引建立成功");
            }
        );
    });
}

exports.insertDocuments = function (CollectionName,json,callback) {
    _OpenDB(function (db) {
        var collection = db.collection(CollectionName);
        // Insert some documents
        collection.insertOne(json, function(err, result) {
            assert.equal(err, null);
            callback(null,result);
        });
    })

}

exports.findDocuments = function (CollectionName,json,args,callback) {
    var limit_mount;
    var skip_mount;
    if(arguments.length ===3){
        callback =args;
        limit_mount = 0;
        skip_mount =0;
    }else if(arguments.length ===4){
        var skip_mount = args.pageamount * (args.page-1) || 0;
        //数目限制
        var limit_mount = args.pageamount || 0;
        //排序方式
        var sort = args.sort || {};
    }
    _OpenDB(function (db) {
        var collection = db.collection(CollectionName);
        // Insert some documents
        collection.find(json).limit(limit_mount).skip(skip_mount).sort(sort).toArray(function(err, docs) {
            assert.equal(err, null);
            callback(null,docs);
        });
    })

}

exports.DelDocuments = function (CollectionName,json,callback) {
    // console.log(json);

    _OpenDB(function (db) {
        var collection = db.collection(CollectionName);
        // Insert some documents
        collection.deleteMany(json, function(err, result) {
            assert.equal(err, null);
            callback(null,result);
        });
    })

}
exports.updateDocuments = function (CollectionName,json1,json2,callback) {
    _OpenDB(function (db) {
        var collection = db.collection(CollectionName);
        // Insert some documents
        collection.updateMany(json1
            , { $set: json2 }, function(err, result) {
                assert.equal(err, null);
                callback(null,result);
            });
    })
}
exports.findAll = function (CollectionName,callback) {
    _OpenDB(function (db) {
        db.collection(CollectionName).count({}).then(function(count) {
            callback(null,count);
            db.close();
        });
    })

}




