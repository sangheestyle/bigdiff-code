/**
 * Module dependencies.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var async = require('async');


/**
 * mongo prototype.
 */

var mongo = exports = module.exports = {};

/**
 * Insert Documents
 *
 * This allows you to insert new document into db.
 * If there has same document, it will create new document.
 * However, if you use ensureIndex, it will raise an error.
 *
 * Please compare to upsert.
 *
 */

mongo.insertDocs = function(params, callback) {
  // open client
  MongoClient.connect(params.url, function(err, db) {
    assert.equal(null, err);
    // select collection and insert
    var collection = db.collection(params.collection);
    collection.insert(params.docs, function(err, result) {
      assert.equal(err, null);
      assert.equal(params.docs.length, result.length);
      db.close();
      callback(err, result);
    });
  });
}

/**
 * Upsert documents
 *
 * If there has already same document in terms of id (github id),
 * it will be updated not insert new one.
 *
 * please do the following in your collection before use this:
 * > db.repo.ensureIndex({'id': 1}, {unique: true, dropDups: true})
 */

mongo.upsertDocs = function(params, callback) {
  MongoClient.connect(params.url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection(params.collection);

    async.times(params.docs.length, function(i, next) {
      collection.update({id: params.docs[i].id}
      , {$set: params.docs[i]}
      , {upsert: true}
      , function(err, result) {
          if (err) {
            console.log('FAIL: ' + params.docs[i].full_name);
            console.log('ERR : ' + err);
          }
          next(err);
      });
    }, function done(err) {
      db.close();
      callback(err);
    });
  });
}
