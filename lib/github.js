/**
 * Module dependencies.
 */

var fs = require('fs');
var octo = require('octonode');
var cassandra = require('cassandra-driver');
var dateRange = require('./utils').dateRange;
var mongo = require('./mongo');
var async = require('async');

/**
 * github prototype.
 */

var github = exports = module.exports = {};

/**
 * Authenticate to github and return client object
 *
 * @param {String} username
 * @param {String} password
 * @return {object} client
 * @api public
 */

github.authClient = function (username, password) {
  var client = octo.client({username: username, password: password});
  return client;
};

/**
 * Send requests to github to retrieve repository issues.
 *
 * TODO: Have the option to repeat this code with state 'closed'
 *
 * @param {object} params
 * @param {Int} cur_page
 * @param {Int} count
 * @api public
 */

github.getRepoIssues = function (params, cur_page, count) {
  if (cur_page == null) {cur_page = 1};
  if (count == null) {count = 0};
  var client = params.client;
  var repo = params.repo;
  var ghrepo = client.repo(repo);

  // Can Repeat this code with state: 'closed'
  ghrepo.issues({page: cur_page, per_page: 100, state: 'open'},
                function(err, data, headers) {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        console.log(count + ' Issues Stored in DB.');
      } else {
        count += data.length;
        github.insertIssues(repo, data);
        github.getRepoIssues(params, cur_page+1, count);
      }
    }
  });
};

/**
 * Insert Repository issues into Cassandra
 *
 * @params {String} repo
 * @params {object} data
 * @api private
 */

github.insertIssues = function (repo, data) {
  //Connect to the cluster
  var client = new cassandra.Client({contactPoints: ['127.0.0.1'],
                                     keyspace: 'bigdiff'});
  var insertIssues = 'INSERT INTO bigdiff.repo_issues (repo_name, url, '
                   + 'html_url, id, number, title, user_login, user_id, '
                   + 'user_url, state, locked, assignee, body) VALUES '
                   + '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  async.times(data.length, function(i, next) {
    // avoid return assignee object which is not string object expected
    var assignee = null;

    if (data[i].assignee) {
      assignee = data[i].assignee.login;
    }

    column_info = [repo, data[i].url, data[i].html_url, data[i].id
                  ,data[i].number, data[i].title, data[i].user.login
                  ,data[i].user.id, data[i].user.url, data[i].state
                  ,data[i].locked, assignee, data[i].body];
    client.execute(insertIssues
                  ,column_info
                  ,{ prepare : true }
                  ,function checkError(err){
                    if (err) {console.log("ERR:" + err)};
                    next(err);
                  });
  }, function done(err){
    client.shutdown();
  });
};

/**
 * Find repositories and upsert repositories' information into db.
 * This calls github.searchRepo sequentially.
 *
 * @api public
 */

github.searchRepos = function(params, callback) {
  var range = dateRange(params.start, params.end);
  var searchOptions = [];
  var upsertParams = { url: params.config.mongo_url
                     , collection: params.config.mongo_collection
                     }

  console.log('query: ' + params.query);
  console.log('range: ' + params.start + ' to ' + params.end);

  range.by('days', function(moment) {
    var date = moment.format('YYYY-MM-DD');
    var query = { q: params.query + ' created:' + date
                , per_page: params.per_page
                }
    searchOptions.push({date: date, query: query, client: params.client});
  });

  async.eachSeries(searchOptions, function(option, callback) {
    github.searchRepo(option, function(err, results) {
      if (err) {
        // error from searchRepo
        console.log(err);
      } else {
        upsertParams.docs = results;
        mongo.upsertDocs(upsertParams, function(err){
          if (err) {
            // error from db
            console.log(err);
          } else {
            var updatedMsg = "UPDATED: " + option.date + " " +
                             results.length + " items";
            console.log(updatedMsg);
          }
        });
      }
      // to the next search
      callback(err);
    });
  }, function(err) {
    // callback for github.searchRepos
    callback(err);
  });
}

/**
 * Find repositories via various criteria.
 *
 * Due to rate-limit for search API, there has setTimeout for 3 seconds
 * after request search query. Also, because search method returns
 * up to 100 results per page, there has step to get last page number.
 * But, it doesn't require additional search request.
 *
 * Reference:
 *   Search: https://developer.github.com/v3/search
 *   pagination: https://developer.github.com/v3/#pagination
 *
 * @api public
 */

github.searchRepo = function(params, callback) {
  var search = params.client.search();
  var pageNum = 1;
  var isFirst = true;
  var qParams = params.query;
  var waitTime = 3000;
  var regex = /[^_]page=([0-9]+)/;
  var results = [];

  async.doWhilst(
    // do first
    function (callback) {
      // If there has results for 5 pages, the sequence of query must be
      // page 1, page 5, page 4, page 3, page 2
      qParams.page = pageNum;
      search.repos(qParams, function(err, data, headers) {
        if (err) {
          callback(err);
        } else {
          if (isFirst && typeof headers.link !== 'undefined') {
            isFirst = false;
            pageNum = headers.link.split(',')[1].match(regex)[1];
            pageNum = Number(pageNum) + 1;
          }
          Array.prototype.push.apply(results, data['items']);
        }
        pageNum--;
      });
      // You can make up to 20 requests per minute for search API
      // So, request query after 3 sec wait.
      // It's really enough due to response time (> 0.5 sec)
      setTimeout(callback, waitTime);
    },
    // test
    function () { return pageNum >= 2;},
    // finish or err
    function (err) {
      callback(err, results);
    }
  );
};
