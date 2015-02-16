var ex = require('child_process').execSync;
var should = require('should');
var git = require('../lib/git');


describe('git', function() {
  var git_path = ex('mktemp -d').toString().trim();
  ex('./gen_test_git.sh ' + git_path);

  describe('#log()', function() {
    it('should return all commits', function() {
      process.chdir(git_path);
      commit_log = git.log(git_path);
      commit_log.should.have.lengthOf(5);
    });

    it('should filter git commits by regex', function() {
      process.chdir(git_path);
      commit_log = git.log(git_path, 'setTag');
      commit_log.should.have.lengthOf(2);
    });
  });

  after(function() {
    ex('rm -rf ' + git_path);
  });
});
