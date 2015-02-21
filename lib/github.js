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
 * Send requests to github to retrieve repository issues.
 *
 * TODO: Authenticated requests get a higher rate limit.
 * TODO: Figure out why this function hangs sometimes.
 *
 * @param {String} repo
 * @param {Int} cur_page Supports Pagination to retrieve all issues.
 * @param {Int} count
 */

// TODO: Need to know how to use github without password
var USER_NAME;
var PASSWD;

github.getRepoIssues = function (repo, cur_page, count) {
  var client = octo.client({username: USER_NAME,
                            password: PASSWD});
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
        github.getRepoIssues(repo, cur_page+1, count);
      }
    }     
  });
};

/** 
 * Insert Repository issues into Cassandra
 *
 * @params {String} repo
 * @params {object} data
 */
github.insertIssues = function (repo, data) {
  //Connect to the cluster
  var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'bigdiff'});
  var insertIssues = 'INSERT INTO bigdiff.repo_issues (repo_name, url, html_url, id, number, '
    + 'title, user_login, user_id, user_url, state, locked, assignee, body) VALUES (?, ?, ?, '
    + '?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  async.times(data.length, function(i, next) {
    column_info = [repo, data[i].url, data[i].html_url, data[i].id, data[i].number,
                   data[i].title, data[i].user.login, data[i].user.id, data[i].user.url,
                   data[i].state, data[i].locked, data[i].assignee, data[i].body];
    client.execute(insertIssues,
                   column_info,
                   { prepare : true }, next);
  }, function done(err){
    client.shutdown();
  });
};

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
  // Cassandra data type timestamp breaks insert_repo (created_at index wont work)
  var insertRepo = 'INSERT INTO bigdiff.repo_info (id, name, full_name, owner_login, '
    + 'owner_id, owner_url, private, html_url, description, url, clone_url, size, '
    + 'stargazers_count, watchers_count, language, has_issues, forks_count, '
    + 'open_issues_count, score) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '
    + '?, ?, ?, ?, ?, ?);';

  async.times(items.length, function(i, next) {
    column_info = [items[i].id, items[i].name, items[i].full_name, items[i].owner.login,
                   items[i].owner.id, items[i].owner.url, items[i].private, items[i].html_url,
                   items[i].description, items[i].url, items[i].clone_url, items[i].size,
                   items[i].stargazers_count, items[i].watchers_count, items[i].language,
                   items[i].has_issues, items[i].forks_count, items[i].open_issues_count,
                   items[i].score];
    client.execute(insertRepo,
                   column_info,
                   { prepare : true }, next);
  }, function done(err){
    client.shutdown();
  });
};

// Example for searchRepos
var query = 'android in:AndroidManifest.xml';
query += ' language:java';
var start = '2015-01-01';
var end = '2015-01-02';
var fileName = 'hello.json';
//github.searchRepos(query, start, end, fileName);

// Example for getRepoIsses
repo = 'github/android';
github.getRepoIssues(repo, 1, 0);
