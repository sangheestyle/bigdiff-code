var ex = require('child_process').execSync;


var log = function(optionalArg) {
  if (typeof optionalArg === 'undefined') {
    optionalArg = "--pretty=format:'" +
      '{ "commit": "%H"' +
      ', "author": "%an"' +
      ', "author_email": "%ae"' +
      ', "date": "%ad"' +
      ', "message": "%f"}' +
      ",'"
  };

  gitLogCommand = 'git log ' + optionalArg;
  var stdout = ex(gitLogCommand).toString();
  stdout = stdout.slice(0, -1)
  var listified = '[' + stdout + ']'

  return JSON.parse(listified)
};

exports.log = log;
