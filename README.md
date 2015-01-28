bigdiff-code
============

# Submodules and functionalities.
The bigdiff-code module will give you 4 submodules for accessing repositories. (TBD)

## github
Access github server based on [octonode](https://github.com/pksunkara/octonode)
* query
* getCommits
* getIssues

## queryResult
View, filter, and export queryResult
* viewSummary
* filterBy
* export

## git
Wrap git functionalities
* clone
* log
* show
* diff

## searcher
Search things on github(remote) or git(local) by key
* searchCommitsByKeyword
* searchIssuesByKeyword
* searchSourceDiff

# Development environment

## Style guide
You will want to understand and follow the style guides listed below.
* [npm](https://docs.npmjs.com/misc/coding-style)

Otherwise, we will follow the style guides listed below.
* [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

## Testing
We will want to create tests in order to be assured that our implementation functions properly.
* [mocha](http://mochajs.org/)
