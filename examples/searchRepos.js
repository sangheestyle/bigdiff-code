var github = require('../lib/github');

var params = {
  query: 'android in:AndroidManifest.xml language:java',
  start: '2013-01-01',
  end: '2013-02-01',
  client: github.authClient(id, password)
};

github.searchRepos(params);
