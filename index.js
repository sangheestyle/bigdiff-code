var express = require('express');
var bodyParser = require('body-parser');

var git = require('./lib/git');

// Constants
var PORT = 80;

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

// return commit lists including given regex pattern
//
// Expected request format:
// $ curl -d '{"regex":"settag"}' -H "Content-Type: application/json" \
//   http://localhost/search/git
//

app.get('/search/git', function (req, res) {
  //var regex = req.body["regex"];
  var params = { path: '.'
               , regex: 'forEach'
               , full_name: 'id/name'
               , context: 1
  };

  git.log(params, function(error, results) {
    if (error) {
      console.log(error);
    } else {
      res.format({
        'text': function() {
          res.send(JSON.stringify(results, null, 2));
        }
      });
    }
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
