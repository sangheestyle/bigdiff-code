var express = require('express');
var bodyParser = require('body-parser');

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
app.post('/search/git', function (req, res) {
  regex = req.body["regex"];
  res.json({regex: regex
           ,repos: [{name: "repo1"
                    ,commits: [{sha:"1a2e3", patch: "bla~"}
                              ,{sha:"2klj3", patch: "blam~"}]}
                   ,{name: "repo2"
                    ,commits: [{sha:"4a2e3", patch: "bla~"}
                              ,{sha:"7klj3", patch: "blam~"}]}]
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
