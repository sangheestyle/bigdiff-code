var github = require('../github');

var params = {
  query: 'android in:AndroidManifest.xml language:java',
  start: '2015-01-01',
  end: '2015-02-01',
  client: github.authClient(id, password)
};

github.searchRepos(params);
