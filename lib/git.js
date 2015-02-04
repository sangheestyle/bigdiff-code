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


function execCommand(command) {
  var stdout = ex(command).toString();
  // need to remove or replace newline chars which make JSON.parse error
  stdout = stdout.slice(0, -1);
  stdout = stdout.replace(/\n\{/g, '{');
  stdout = stdout.replace(/\n/g, '\\n');
  var listifiedOutput = '[' + stdout + ']';
  return listifiedOutput;
}
