/**
 * Module dependencies.
 */

var syncEx = require('child_process').execSync;
var exec = require('child_process').exec;
var fs = require('fs');
var async = require('async');
var os = require('os');

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

git.log = function (params, callback) {
  var path = params.path;
  var regex = params.regex;
  var full_name = params.full_name;
  var prettyFormat = params.prettyFormat;
  var context = params.context;
  var cur_dir = process.cwd();

  if (fs.existsSync(path)) {
    process.chdir(path);
  } else {
    callback(new Error('Path not exist: ' + path));
    return;
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

  var output = this.execCommand(command);
  output = JSON.parse(output);

  async.times(output.length, function(n, next){
    git.grep({id: output[n].id, regex: regex, context: context},
      function(err, result) {
        next(err, result);
      }
    );
  }, function(err, results) {
    process.chdir(cur_dir);
    for (var i = 0; i < output.length; i++){
      if (output[i].id === results[i].id){
        output[i].chunk = results[i].chunk;
      }
    }
    var log_results = { full_name: full_name
                      , regex: regex
                      , results: output
    };
    callback(null, log_results);
  });
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

git.grep = function (params, callback) {
  var id = params.id;
  var regex = params.regex;
  var context = params.context;

  if (typeof context === 'undefined') {
    context = 0;
  };

  var command = 'git show ' + id +
    ' | egrep -C ' + context + ' ' + regex;

  try {
    output = syncEx(command).toString();
  } catch (err) {
    console.log('> not found the pattern in', id, '\n');
    callback(err);
    return;
  }

  callback(null, {id: id, chunk: output});
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

git.clone = function (params, callback) {
  var root = params.root;
  var clone_url = params.clone_url;
  var full_name = params.full_name;
  var command = 'git clone ' + clone_url + ' ' + full_name;
  var child;
  var cur_dir = process.cwd();

  if (root){
    if (fs.existsSync(root)) {
      process.chdir(root);
    } else {
      process.chdir(cur_dir);
      callback(new Error("Path not exist: " + root));
      return;
    }
  }

  child = exec(command, function (error, stdout, stderr) {
    process.chdir(cur_dir);
    if (error) {
      callback(error);
    } else {
      console.log("Cloned: " + full_name);
      callback(null);
    };
  });
};

/**
 * Clone multiple repositories.
 *
 * Git will do clone in current path, if the path is not given.
 *
 * urlNames = {
 *  root: '/path/to/root',
 *  list: [{
 *    clone_url: "https://github.com/sangheestyle/flatiron.git"
 *   ,full_name: "sangheestyle/flatiron"},{
 *    clone_url: "https://github.com/sangheestyle/grader.git"
 *   ,full_name: "sangheestyle/grader"}]
 *  }
 *
 * @param {String} urlNames
 * @api public
 */

git.multipleClone = function (urlNames) {
  if (!fs.existsSync(urlNames.root)){
    fs.mkdirSync(urlNames.root);
  }
  var numCores = os.cpus().length;
  var params = []
  urlNames.list.forEach(function (element, index, array) {
    params.push({clone_url: element.clone_url
                ,full_name: element.full_name
                ,root: urlNames.root
    });
  });
  async.eachLimit(params, numCores*2, git.clone, function(error){
    if (error) {
      console.log(error);
    }
  });
};
