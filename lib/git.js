/**
 * Module dependencies.
 */

var syncEx = require('child_process').execSync;
var exec = require('child_process').exec;
var fs = require('fs');

/**
 * Git prototype.
 */

var git = exports = module.exports = {};

/**
 * Do git log with given regular expression.
 * Returns a list object of git log.
 *
 * You can change also prettyFormat if you want to use specific format.
 *
 * @param {String} path
 * @param {String} regex
 * @param {String} prettyFormat
 * @return {JSON} git log
 * @api public
 */

git.log = function (path, regex, prettyFormat) {
  var cur_dir = process.cwd();

  if (fs.existsSync(path)) {
    process.chdir(path);
  } else {
    console.log("Path not exist: " + path);
    return null;
  }

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

  output = this.execCommand(command);
  process.chdir(cur_dir);

  return JSON.parse(output);
};

/**
 * Grep commits by given regular expression and context.
 * Context is number of line.
 * Returns a list object including commits.
 *
 * The given commits may include the regex pattern.
 *
 * @param {commits} commits
 * @param {String} regex
 * @param {number} context
 * @return {object} commitList
 * @api public
 */

git.grep = function (commits, regex, context) {
  if (typeof context === 'undefined') {
    context = 0;
  };

  var commitList = [];
  for (var idx in commits) {
    var id = commits[idx].id;
    command = 'git show ' + id +
      ' | egrep -C ' + context + ' ' + regex;
    try {
      output = syncEx(command).toString();
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

/**
 * Execute given command.
 * Returns a list object including output.
 *
 * @param {String} command
 * @return {object} listifiedOutput
 * @api private
 */


git.execCommand = function (command) {
  var stdout = syncEx(command).toString();
  // need to remove or replace newline chars which make JSON.parse error
  stdout = stdout.slice(0, -1);
  stdout = stdout.replace(/\n\{/g, '{');
  stdout = stdout.replace(/\n/g, '\\n');
  var listifiedOutput = '[' + stdout + ']';

  return listifiedOutput;
};

/**
 * Clone just only one git repository.
 *
 * clonned repository will be under the path, full_name.
 * For example,
 *
 * "clone_url":"https://github.com/sangheestyle/bigdiff-code.git"
 * "full_name":"sangheestyle/bigdiff-code"
 *
 * and command:
 * $ git clone clone_url full_name
 *
 * @param {String} cloneUrl
 * @param {String} fullName
 * @param {String} path
 * @api public
 */

git.clone = function (cloneUrl, fullName, path) {
  var command = 'git clone ' + cloneUrl + ' ' + fullName;
  var child;
  var cur_dir = process.cwd();

  if (path){
    if (fs.existsSync(path)) {
      process.chdir(path);
    } else {
      console.log("Path not exist: " + path);
      return null;
    }
  }

  child = exec(command, function (error, stdout, stderr) {
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });

  process.chdir(cur_dir);
};

/**
 * Clone multiple repositories.
 *
 * Git will do clone in current path, if the path is not given.
 *
 *  urlNameList = [{
 *    clone_url: "https://github.com/sangheestyle/flatiron.git"
 *   ,full_name: "sangheestyle/flatiron"},{
 *    clone_url: "https://github.com/sangheestyle/grader.git"
 *   ,full_name: "sangheestyle/grader"}]
 *
 * @param {String} urlNameList
 * @param {String} path
 * @api public
 */

git.multipleClone = function (urlNameList, path) {
  urlNameList.forEach(function (element, index, array) {
    git.clone(element.clone_url, element.full_name, path);
  });
};
