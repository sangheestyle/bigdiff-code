var cassandra = require('cassandra-driver');
var git = require('../lib/git');


var params = {
  query: 'select * from bigdiff.repo_info'
       + ' where size > 3000 and size < 100000'
       + ' allow filtering;',
};
var client = new cassandra.Client({contactPoints: ['127.0.0.1'],
                                  keyspace:'bigdiff'});
var urlNames = {
  root: '/home/user/RA-Work/sampleRepos/',
  list: []
};

client.execute(params.query, null, function(err, result) {
  client.shutdown();
  if (err) {
    console.log(err);
  } else {
    console.log('result: ' + result.rows.length + " items");
    for (i = 0; i < result.rows.length; i++) {
      var repo = result.rows[i];
      if ((repo.forks_count > 200) && (repo.watchers_count > 200)) {
        urlNames.list.push({clone_url:repo.clone_url
                         ,full_name:repo.full_name});
      }
    }
    console.log('filtered: ' + urlNames.list.length + " items");
    git.multipleClone(urlNames);
  }
});
