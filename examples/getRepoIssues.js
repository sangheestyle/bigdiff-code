var github = require('../lib/github');

var username = 'username';
var password = 'password';
var client = github.authClient(username, password);

repo = 'github/android';
params = {client: client, repo: repo};
github.getRepoIssues(params);
