var express = require('express');
var bodyParser = require('body-parser');
var readdirp = require('readdirp');

var git = require('./lib/git');

// Constants
var PORT = 8080;

// App
var app = express();
app.use(bodyParser.json());

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
 *  return commit lists including given regex pattern
 */

app.get('/search/git', function (req, res) {
  var root = '/home/sanghee/testClone';
  var regex = '".setTag\([^,|^\(]*,[^,]*\)"';
  var ext = 'java';

  //TODO: I need to put res.close() somewhere but I don't know
  readdirp({ root: root, depth: 1, entryType: 'directories'})
    .on('data', function (entry) {
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
              } else {
                console.log("Not Found in " + results.full_name);
                res.write("Not Found in " + results.full_name + '\n');
              }
            }
          });
      }
    });
});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
