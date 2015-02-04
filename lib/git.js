var ex = require('child_process').execSync;


exports.log = function (regex, prettyFormat) {
  if (typeof prettyFormat === 'undefined') {
    prettyFormat = "--pretty=format:'" +
      '{ "id": "%H"' +
      ', "author_name": "%an"' +
      ', "author_email": "%ae"' +
      ', "date": "%ad"' +
      ', "subject": "%s"' +
      ', "body": "%b"}' +
      ",'";
  };

  var gitLogCommand = 'git log ' + prettyFormat;
  if (typeof regex !== 'undefined') {
    gitLogCommand = gitLogCommand + ' -G' + regex;
  };

  var stdout = ex(gitLogCommand).toString();
  stdout = stdout.slice(0, -1);
  var listified = '[' + stdout + ']';
  // JSON.parse can't parse new line characters with stringify
  var jsonifiedGitLog = JSON.parse(JSON.stringify(listified));

  return jsonifiedGitLog;
}
