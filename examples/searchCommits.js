/*
 * This example shows return

{ full_name: 'id/name',
  regex: 'given_regex',
  results:
   [ { id: '0f9673f41ee6a9bb5aeebb54c9641842345b40f9',
       author_name: 'Author Name',
       author_email: 'doubledouble@nonoyesyesues.com',
       date: 'Fri Jan 16 12:35:42 2015 -0700',
       subject: 'first line of commit message',
       body: 'body of commit message but usually empty' } ] }
*/

var git = require('../lib/git');

git.log({path: '.', regex: 'forEach', full_name: 'id/name'},
  function(error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
});
