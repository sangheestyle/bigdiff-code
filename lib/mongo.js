/**
 * Module dependencies.
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

/**
 * mongo prototype.
 */

var mongo = exports = module.exports = {};

/**
 * Insert Documents
 *
 * If you want to insert only unique documents,
 * please do the following in your collection before use this:
 *
 * > db.repo.ensureIndex({'id': 1}, {unique: true, dropDups: true})
 *
 * then it will make error when the item is already existed
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
