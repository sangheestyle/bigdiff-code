var express = require('express');
var bodyParser = require('body-parser');
var readdirp = require('readdirp');
var path = require('path');

var git = require('./lib/git');
var mongo = require('./lib/mongo');
var config = require('./config.json');


var PORT = 8080;
var app = express();
var html_dir = './html/';
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'html')));


/*
 * Index
 */
app.get('/', function (req, res) {
  res.json({message: "Hey! You are very welcome."
  });
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
  var html = '<form action="/search/commits" method="post">' +
               '<h1>Search patterns on cloned repos</h1>' +
               'For example: .setTag\\\\([^,|^\\\\(]*,[^,]*\\\\)' +
               '<br>' +
               'Use two backslashes instead of one backslash.' +
               '<br>' +
               'Also, it takes really long time, please bare with me.' +
               '<br>' +
               'regex:' +
               '<input type="text" name="regex" placeholder=".setTag\\\\([^,|^\\\\(]*,[^,]*\\\\)" />' +
               '<br>' +
               '<br>' +
               'extension:' +
               '<input type="text" name="ext" placeholder="java" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
  res.send(html);
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
