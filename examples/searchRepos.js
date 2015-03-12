var github = require('../lib/github');
var config = require('../config.json');

var id = config.github_id;
var password = config.github_password;
var params = { query: 'android in:name,description,readme'
             , start: '2015-01-15'
             , end: '2015-01-20'
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
