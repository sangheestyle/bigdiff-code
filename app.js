var express = require('express');
var bodyParser = require('body-parser');
var readdirp = require('readdirp');
var path = require('path');
var jade = require('jade');
var CronJob = require('cron').CronJob;

var git = require('./lib/git');
var github = require('./lib/github');
var mongo = require('./lib/mongo');
var config = require('./config.json');


var PORT = 8080;
var app = express();
var html_dir = './html/';
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'html')));
app.set('views', './views');
app.set('view engine', 'jade');

/*
 * Index
 */
app.get('/', function (req, res) {
  res.render('index',
    { title: 'Hey', message: 'You are very welcome.'}
  );
});


/*
 * Authors
 */
app.get('/who_am_i', function (req, res) {
  res.json({name: "Sanghee Kim"
	  ,collaborator: ["Brennan", "Mazin Hakeem"]
	  ,favorites: ["coffee"]
          ,int_num: 5
          ,float_num: 5.12
  });
});


/*
 * show dashboard to represent current status of MUSE
 */
app.get('/dashboard', function(req, res) {
  res.sendfile(html_dir + 'dashboard.html');
});


/*
 * get regex and extension and do post with them
 */
app.get('/search/commits', function(req, res) {
  res.render('search_commits',
    {title: "Search"}
  );
});


/*
 *  Searching commits for regex and show them in html format
 */
app.post('/search/commits', function (req, res) {
  var config = require('./config.json');
  var root = config.local_repo_root;
  // For console input, the regex string requires double qoutes
  var regex = '"' + req.body.regex + '"';
  var ext = req.body.ext;

  //TODO: I need to put res.close() somewhere but I don't know
  var count = 0;
  var MAX_RESULT = 5;
  readdirp({ root: root, depth: 1, entryType: 'directories'})
    .on('data', function (entry) {
      // show only limited-number of results
      if (count > MAX_RESULT) {
        res.end();
        return null;
      }

      if (entry.parentDir !== '') {
        git.log({ path: entry.fullPath
                , regex: regex
                , ext: ext
                , full_name: entry.path
          },function (error, results) {
            if (error) {
              console.log(error);
            } else {
              if (results.results.length !== 0) {
                console.log("Found in " + results.full_name);
                console.log(results);
                res.write("Found in " + results.full_name + '\n');
                res.write(JSON.stringify(results, null, 2));
                res.write('\n');
                count += 1;
              } else {
                console.log("Not Found in " + results.full_name);
                res.write("Not Found in " + results.full_name + '\n');
              }
            }
          });
      }
    })
    .on('end', function () {
      res.end();
    });
});


/*
 * REST API for searching result for regex pattern.
 * Internal behavior of this function is exactly same with /search/commits.
 *
 * TODO: avoid redundancy. Make another function for search commit and use it for
 * /search/commits and this function.
 */
app.post('/api/search/commits', function (req, res) {
  var config = require('./config.json');
  var root = '/home/sangheestyle_gmail_com/muse_repos/' + req.body.local_repo_root + '/';
  console.log(root);
  // For console input, the regex string requires double qoutes
  var regex = '"' + req.body.regex + '"';
  var ext = req.body.ext;

  var count = 0;
  var MAX_RESULT = req.body.max;
  readdirp({ root: root, depth: 1, entryType: 'directories'})
    .on('data', function (entry) {
      // show only limited-number of results
      if (count > MAX_RESULT) {
        res.end();
        return null;
      }

      if (entry.parentDir !== '') {
        git.log({ path: entry.fullPath
                , regex: regex
                , ext: ext
                , full_name: entry.path
          },function (error, results) {
            if (error) {
              console.log(error);
            } else {
              if (results.results.length !== 0) {
                console.log("Found in " + results.full_name);
                console.log(results);
                res.write("Found in " + results.full_name + '\n');
                res.write(JSON.stringify(results, null, 2));
                res.write('\n');
                count += 1;
              } else {
                console.log("Not Found in " + results.full_name);
              }
            }
          });
      }
    })
    .on('end', function () {
      res.end();
      return null;
    });
});


/*
 * REST API: return number of repo by date
 */
app.get('/muse/count', function (req, res) {
  var group =
    [
      {
        $group: {
          _id: {
            year: {$year: "$created_at"},
            month: {$month: "$created_at"},
            day: {$dayOfMonth: "$created_at"}},
          count: {$sum: 1}
        }
      }
    ];
  var params = { url: config.mongo_url
               , collection: config.mongo_collection
               , group: group
  };

  mongo.group(params, function(err, result) {
    var jsonResult =  []
    result.forEach(function(entry) {
      var date = entry._id.year + "-" + entry._id.month + "-" + entry._id.day;
      date = new Date(Date.parse(date)).toISOString().slice(0, 10);
      jsonResult.push({date: date, count: entry.count});
    });
    res.jsonp({result: jsonResult});
  });
});


/*
 * main
 */
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

/*
 * JOB: search repos for github
 * Runs everyday (Sunday through Saturday)
 * at 00:00:01 AM.
 */

var jobSearchRepos = new CronJob({
  cronTime: '01 00 00 * * 0-6',
  onTick: function() {
    var id = config.github_id;
    var password = config.github_password;
    var params = { query: 'android in:name,description,readme'
                 , start: '2011-01-01'
                 , end: new Date().toJSON().slice(0,10)
                 , per_page: 100
                 , client: github.authClient(id, password)
                 , config: config
                 };

    github.searchRepos(params, function(err) {
      if (err) {
        console.log('FAILED: Search Repos.');
        console.log(err);
      } else {
        console.log('DONE: Search Repos.');
      }
    });
  },
  start: false,
  timeZone: 'America/Denver'
});
jobSearchRepos.start();
