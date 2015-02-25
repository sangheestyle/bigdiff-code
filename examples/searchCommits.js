/*
 * This example shows return multiple commits filtered by
 * given regex and extension.

{ full_name: 'id/name',
  regex: 'given_regex',
  results:
   [ { id: '0f9673f41ee6a9bb5aeebb54c9641842345b40f9',
       author_name: 'Author Name',
       author_email: 'doubledouble@nonoyesyesues.com',
       date: 'Fri Jan 16 12:35:42 2015 -0700',
       subject: 'first line of commit message',
       body: 'body of commit message but usually empty'
       chunk: 'chunk of files' } ] }
*/

var readdirp = require('readdirp');
var git = require('../lib/git');


var root = '/path/to/repoRoot';
var regex = 'setTag';
var ext = 'java';

readdirp({ root: root, depth: 1, entryType: 'directories'})
  .on('data', function (entry) {
    if (entry.parentDir !== '') {
      git.log({ path: entry.fullPath
              , regex: regex
              , ext: ext
              , full_name: entry.path
        },function (error, results) {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
          }
        });
    }
  });
