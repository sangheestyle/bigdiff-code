bigdiff-code
============

# Sub modules and functionalities.
This module will give you 4 submodule for accessing repositories. (TBD)

## github
Access github server based on [octonode](https://github.com/pksunkara/octonode)
* query
* getCommit
* getIssue

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
* searchIssueByKeyword
* searchSourceDiff

# Development environment

## Style guide
You might want to understand and follow the following style guide.
* Node: [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

## Testing
We might want to do test for getting confident for our implementation.
* [mocha](http://mochajs.org/)
