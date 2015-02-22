var github = require('../github');

var query = 'android in:AndroidManifest.xml';
query += ' language:java';
var start = '2015-01-01';
var end = '2015-01-02';
var fileName = 'hello.json';
github.searchRepos(query, start, end, fileName);