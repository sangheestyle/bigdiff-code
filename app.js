var express = require('express');
var bodyParser = require('body-parser');
var readdirp = require('readdirp');
var path = require('path');

var git = require('./lib/git');
var mongo = require('./lib/mongo');
var config = require('./config.json');

// Constants
var PORT = 8080;

// App
var app = express();
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'html')));
var html_dir = './html/';

/*
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
          next();
});
*/

app.get('/', function (req, res) {
  res.json({message: "Hey! You are very welcome."
  });
});

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
 *  return commit lists including given regex pattern
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

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
