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

  return outputToJSON(execCommand(command));
};


function execCommand(command) {
  var stdout = ex(command).toString();
  stdout = stdout.slice(0, -1);
  var listifiedOutput = '[' + stdout + ']';
  return listifiedOutput;
}


function outputToJSON(output) {
  // JSON.parse can't parse new line characters with stringify
  return JSON.parse(JSON.stringify(output));
}
