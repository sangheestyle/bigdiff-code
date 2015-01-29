var api = require('./github')
var lib = {}
var fs = require('fs')
var jf = require('jsonfile')
var util = require('util')

module.exports = lib

getReposInQueryResults = function(queryResults) {
	return
	//TODO: Implement this function once github.query has been implemented
}

getReposInDirectory = function(directory) {
	var repoList = fs.readdirSync(directory)
	return repoList
}

searchCommitsForKeyword = function(JsonToParse, out_dir, repo, keyword) {
	var JsonToReturn = out_dir + repo +"_" + keyword + ".json"
	fs.open(JsonToReturn, 'a')
	var rePattern = new RegExp(keyword)
	var matches = 0

	var obj = JSON.parse(fs.readFileSync(JsonToParse, "utf8"));
	//TODO: Structure the appending to append appropriate data for a commit json file once sample data can be accessed
	for (var i = 0; i < obj.data.length; i++) {
		var found = obj.data[i].message.match(rePattern)
		if (found != null) {
			fs.appendFileSync(JsonToReturn, obj.data[i].message + "\n", 'utf-8')
			matches += 1
		}
	}
	return matches
}

searchRemoteRepoCommits = function(repo, keyword, out_dir) {
	var JsonToParse = null //TODO: Implement this line once github.searchCommits(repo) has been implemented

	var count = searchCommitsForKeyword(JsonToParse, out_dir, repo, keyword)
	return count
}

searchLocalRepoCommits = function(in_dir, repo, keyword, out_dir){
	var JsonToParse = in_dir+repo //TODO: This line will change to git.commit(repo) once it is implemented

	var count = searchCommitsForKeyword(JsonToParse, out_dir, repo, keyword)
	return count
}

lib.searchReposForKeywords = function(in_dir, keywords, out_dir) {
	var count
	var isDir = fs.lstatSync(in_dir).isDirectory()

	var repoList = getReposInDirectory(in_dir)
	for (var i = 0; i < repoList.length; i++) {
		for (var j = 0; j < keywords.length; j++) {
			if (isDir == true) {
				count = searchLocalRepoCommits(in_dir, repoList[i], keywords[j], out_dir)
			} else {
				count = searchRemoteRepoCommits(repoList[i], keywords[j], out_dir)
			}
			console.log("Found " + count + " match(es) for keyword \'" + keywords[j] + "\' in repo " + repoList[i])
		}
	}
}

lib.searchReposForKeywords("/home/user/RA-Work/bd/lib/sampleData/sampleIn/", ["contract", "forward"], "/home/user/RA-Work/bd/lib/sampleData/sampleOut/")


