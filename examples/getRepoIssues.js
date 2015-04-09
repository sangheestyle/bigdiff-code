var github = require('../lib/github');
var config = require('../config.json');

var id = config.github_id;
var password = config.github_password;
var params = { per_page: 100
			 , state: 'open'
             , client: github.authClient(id, password)
             , config: config
             };

github.getRepoIssues(params);




