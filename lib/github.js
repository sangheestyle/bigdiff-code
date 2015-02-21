/**
 * Module dependencies.
 */

var fs = require('fs');
var octo = require('octonode');
var cassandra = require('cassandra-driver');
var dateRange = require('./utils').dateRange;
var async = require('async');

/**
 * github prototype.
 */

var github = exports = module.exports = {};

/**
 * Sending query to github server for searching repos.
 * Basically without authenticate, you can query only for 30 times per min.
 *
 * TODO: Authenticated requests get a higher rate limit.
 *
 * @param {String} query
 * @param {String} regex
 * @param {String} prettyFormat
 * @return {JSON} git log
 * @api public
 */

github.searchRepos = function (query, start, end, fileName) {
  var client = octo.client();
  var search = client.search();
  var range = dateRange(start, end);
  var counter = 0;
  var waitTime = 0;
  var totalCount = 0;

  console.log('query: ' + query);
  console.log('range: ' + start + ' to ' + end);

  range.by('days', function(moment) {
    var date = moment.format('YYYY-MM-DD');
    var curQuery = query + ' created:' + date;

    counter += 1;
    if ((counter % 30) === 0) {
      waitTime = 60000;
    } else {
      waitTime = 0;
    }

    setTimeout(function() {
      search.repos({q: curQuery, per_page: 100}, function(err, data, headers) {
        if (err) {
          // It should be 'Error: API rate limit exceeded'
          console.log(err);
        } else {
          var currentCount = data['items'].length;
          totalCount += currentCount;
          console.log('OK: ' + 'current ' + currentCount + ' / ' +
                      'total ' + totalCount);
          github.insertRepo(data['items']);
          //console.log(data['items']);
        }
      });
    }, waitTime);
  });
};

/**
 * Insert items into Cassandra
 *
 * @param {object} params
 * @api public
 */

github.insertRepo = function (items) {
  //Connect to the cluster
  var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'bigdiff'});
  var insertRepo = 'INSERT INTO bigdiff.repo_info (id, name, full_name) '
    + 'VALUES(?, ?, ?);';

  async.times(items.length, function(i, next) {
    client.execute(insertRepo,
                   [items[i].id, items[i].name, items[i].full_name],
                   { prepare : true }, next);
  }, function done(err){
    client.shutdown();
  });
};

// Example
var query = 'android in:AndroidManifest.xml';
query += ' language:java';
var start = '2015-01-01';
var end = '2015-01-02';
var fileName = 'hello.json';
github.searchRepos(query, start, end, fileName);

