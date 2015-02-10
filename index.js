var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.get('/who_am_i', function (req, res) {
  res.json({name: "Sanghee Kim"
	  ,collaborator: ["Brennan", "Mazin Hakeem"]
	  ,favorites: ["coffee"]
          ,int_num: 5
          ,float_num: 5.12
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
