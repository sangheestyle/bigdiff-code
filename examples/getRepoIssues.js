var github = require('../lib/github');
var config = require('../config.json');
var mongo = require('../lib/mongo');

var id = config.github_id;
var password = config.github_password;
var params = { per_page: 100
			 , state: 'open'
             , client: github.authClient(id, password)
             , config: config
             , url: config.mongo_url
             , collection: "reposCloned"
             , fields: { full_name: 1, clone_url: 1, _id: 0}
             };

mongo.find(params, function(err, items) {
  for (var i = 0; i < items.length; i++) {
  	params.repo = items[i].full_name;
  	github.getRepoIssues(params);
  };
});










