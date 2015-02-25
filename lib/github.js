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
 * Sending query to github server for searching repos.
 *
 * @param {String} params
 * @api public
 */

github.searchRepos = function (params) {
  var query = params.query;
  var start = params.start;
  var end = params.end;
  var range = dateRange(params.start, params.end);
  var limit = 1;
  var searchOptions = [];

  console.log('query: ' + query);
  console.log('range: ' + start + ' to ' + end);

  range.by('days', function(moment) {
    var date = moment.format('YYYY-MM-DD');
    searchOptions.push({ date: date
                       , client: params.client
                       , q: { q: query + ' created:' + date
                            , per_page: 100
                       }
    });
  });

  var count = 0;
  async.whilst(
    function () { return count < searchOptions.length; },
    function (callback) {
      github.searchRepo(searchOptions[count], function (error) {
        if (error) {
          console.log(error);
        }
      });
      count++;
      if (count%10 === 0) {
        console.log("Progress: "
                    + count + "/" + searchOptions.length + " ...");
      }
      // waiting for 9 sec due to rate-limit of github search
      // 20 requests per min only
      setTimeout(callback, 9000);
    },
    function (err) {
      if (err) {
        console.log(error);
      } else {
        console.log("Done: " + searchOptions.length + " requests");
      }
    }
  );
};

/**
 * Sending query to github server for searching repos.
 *
 * @param {String} params
 * @api private
 */

github.searchRepo = function (params, callback) {
  var search = params.client.search();
  var date = params.date;
  var param = params.q;
  param.page = 1;

  github.getSearchNumberOfPages(params, function (err, num) {
    for (var i = 2; i <= num; i++) {
      param.page = i;
      search.repos(params.q, function (err, data, headers) {
        if (err) {
          callback(err);
          return;
        }
        github.insertRepo(data['items'], function (err) {
          if (err) {
            console.log("FAIL: " + date);
            callback(err);
          } else {
            console.log("UPDATED: "+date+" "+data['items'].length+" items");
            callback(null, data);
          }
        });
      });
    }
  });
};

/*
 * Return number of pages
 */

github.getSearchNumberOfPages = function (params, callback) {
  var search = params.client.search();
  var date = params.date;
  var regex = /[^_]page=([0-9]+)/;
  var numberOfPages;
  params.q.page = 1;

  search.repos(params.q, function(err, data, headers) {
    if (err) {
      callback(err);
    } else {
      github.insertRepo(data['items'], function (err) {
        if (err) {
          console.log("FAIL: " + date);
        } else {
          console.log("UPDATED: "+date+" "+data['items'].length+" items");
        }
      });
      // no link means no pagenation
      if (typeof headers.link === 'undefined') {
        numberOfPages = 1;
      } else {
        numberOfPages = headers.link.split(',')[1].match(regex)[1];
      }
      callback(null, numberOfPages);
    }
  });
};

/**
* Send requests to github to retrieve repository issues,
* and insert data into DB.
*
* TODO: Figure out why this function hangs sometimes.
*
* @param {object} params
* @api public
*/

/**
 * Insert items into Cassandra
 *
 * @param {object} items
 * @api private
 */

github.insertRepo = function (items, callback) {
  var client = new cassandra.Client({contactPoints: ['127.0.0.1'],
                                     keyspace: 'bigdiff'});

  var insertRepo = 'INSERT INTO bigdiff.repo_info (id, name, full_name, '
                 + ' owner_login, owner_id, owner_url, private, html_url, '
                 + ' description, url, clone_url, size, stargazers_count, '
                 + ' watchers_count, language, has_issues, forks_count, '
                 + 'open_issues_count, score) VALUES(?, ?, ?, ?, ?, ?, ?, '
                 + '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

  async.times(items.length, function(i, next) {
    column_info = [items[i].id, items[i].name, items[i].full_name,
                   items[i].owner.login, items[i].owner.id, items[i].owner.url,
                   items[i].private, items[i].html_url, items[i].description, 
                   items[i].url, items[i].clone_url, items[i].size,
                   items[i].stargazers_count, items[i].watchers_count,
                   items[i].language, items[i].has_issues,items[i].forks_count,
                   items[i].open_issues_count, items[i].score];
    client.execute(insertRepo
                  ,column_info
                  ,{ prepare : true }
                  ,function checkError(err){
                     if (err) {
                       console.log('FAIL: ' + items[i].full_name);
                       console.log('ERR :' + err);
                     } else {
                       //console.log('UPDATED: ' + items[i].full_name);
                     }
                     next(err);
                  });
  }, function done(err){
    client.shutdown();
    callback(err);
  });
};
