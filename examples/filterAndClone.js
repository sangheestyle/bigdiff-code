var mongo = require('../lib/mongo');
var git = require('../lib/git');
var config = require('../config.json');

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
  urlNames.list = items;
  git.multipleClone(urlNames);
});
