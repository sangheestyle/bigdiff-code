var github = require('../lib/github');
var config = require('../config.json');

var id = config.github_id;
var password = config.github_password;
var params = {
  query: 'android in:name,description,readme',
  start: '2011-01-01',
  end: '2015-03-01',
  client: github.authClient(id, password)
};

github.searchRepos(params);
