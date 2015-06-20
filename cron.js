var CronJob = require('cron').CronJob;

var git = require('./lib/git');
var github = require('./lib/github');
var mongo = require('./lib/mongo');
var config = require('./config.json');

/*
 * JOB: search repos for github
 * Runs everyday (Sunday through Saturday)
 * at 00:00:01 AM.
 */

var jobSearchRepos = new CronJob({
  cronTime: '01 00 00 * * 0-6',
  onTick: function() {
    var id = config.github_id;
    var password = config.github_password;
    var params = { query: 'android in:name,description,readme'
                 , start: '2011-01-01'
                 , end: new Date().toJSON().slice(0,10)
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
  },
  start: false,
  timeZone: 'America/Denver'
});
jobSearchRepos.start();

/*
 * JOB: clone repos after filter
 * Runs everyday (Sunday through Saturday)
 * at 00:00:01 AM.
 */

var jobCloneRepos = new CronJob({
  cronTime: '01 00 00 * * 0-6',
  onTick: function() {
    var params = { url: config.mongo_url
                 , collection: config.mongo_collection
                 , query: { watchers: { $gte: 5}
                          , size: {$lte: 40960}
                          , default_branch: "master"
                          , "private": false}
                 , fields: { full_name: 1, clone_url: 1, _id: 0}
    };
    var urlNames = {
      root: config.local_repo_root,
      list: []
    };

    mongo.find(params, function(err, items) {
      console.log('=== Starting clone repos for ' + items.length
                  + ' items');
      urlNames.list = items;
      git.multipleClone(urlNames);
    });
  },
  start: false,
  timeZone: 'America/Denver'
});
jobCloneRepos.start();
