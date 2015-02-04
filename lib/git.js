var ex = require('child_process').execSync;


var log = function(prettyFormat) {
  if (typeof prettyFormat === 'undefined') {
    prettyFormat = "--pretty=format:'" +
      '{ "id": "%H"' +
      ', "author_name": "%an"' +
      ', "author_email": "%ae"' +
      ', "date": "%ad"' +
      ', "subject": "%s"' +
      ', "body": "%b"}' +
      ",'"
  };

  gitLogCommand = 'git log ' + prettyFormat;
  var stdout = ex(gitLogCommand).toString();
  stdout = stdout.slice(0, -1)
  var listified = '[' + stdout + ']'
  // JSON.parse can't parse new line characters with stringify
  var jsonifiedGitLog = JSON.parse(JSON.stringify(listified))

  return jsonifiedGitLog
};

exports.log = log;
