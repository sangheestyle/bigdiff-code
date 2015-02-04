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

  var command = 'git log ' + prettyFormat;
  if (typeof regex !== 'undefined') {
    command = command + ' -G' + regex;
  };

  return JSON.parse(execCommand(command));
};


exports.grep = function (commits, regex, context) {
  if (typeof context === 'undefined') {
    context = 0;
  };

  var commitList = [];
  for (var idx in commits) {
    var id = commits[idx].id;
    command = 'git show ' + id +
      ' | egrep -C ' + context + ' ' + regex;
    try {
      output = ex(command).toString();
    } catch (err) {
      console.error('>>> exit status was', err.status);
      console.error('> stderr', err.stderr);
      console.error('> not found the pattern in', id, '\n');
      output = '';
    }
    commitList.push({id: id, contents: output});
  };

  return commitList;
};


function execCommand(command) {
  var stdout = ex(command).toString();
  // need to remove or replace newline chars which make JSON.parse error
  stdout = stdout.slice(0, -1);
  stdout = stdout.replace(/\n\{/g, '{');
  stdout = stdout.replace(/\n/g, '\\n');
  var listifiedOutput = '[' + stdout + ']';

  return listifiedOutput;
}
