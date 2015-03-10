var mongo = require('../lib/mongo');
var git = require('../lib/git');


var params = { url: "mongodb://localhost:27017/muse"
             , collection: "repo"
             , query: {watchers: {$gte: 5}, size: {$lte: 20480}}
             , fields: {full_name: 1, clone_url: 1, _id: 0}
};
var urlNames = {
  root: '/home/sanghee/muse_git_repo/',
  list: []
};

mongo.find(params, function(err, items) {
  urlNames.list = items;
  git.multipleClone(urlNames);
});
