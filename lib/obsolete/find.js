var api = require('./api')
var lib = {}
module.exports = lib

lib.findCommitByKeywords = function(keywords){
	// 

	// get a list of repoNames
	var repoNames = // get a list of repos

	// call api
	repoNames.forEach(function (repoName){
		var listOfJsons = api.commits(repoName) 	
		// your logic



	})
	

	


	return "another json"
}