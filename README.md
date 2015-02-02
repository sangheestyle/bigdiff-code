# bigdiff-code
check

## Setup
To setup the environment, run:
```shell
$ git clone https://github.com/sangheestyle/bigdiff-code
$ cd bigdiff-code
$ nvm install
$ make test
```
That's it!

## Submodules and functionalities
The bigdiff-code module will give you 4 submodules for accessing repositories. (TBD)

### github
Access github server based on [octonode](https://github.com/pksunkara/octonode)
* query
* getCommits
* getIssues

### queryResult
View, filter, and export queryResult
* viewSummary
* filterBy
* export

### git
Wrap git functionalities
* clone
* log
* show
* diff

### searcher
Search things on github(remote) or git(local) by key
* searchCommitsByKeyword
* searchIssuesByKeyword
* searchSourceDiff

## Testing
We use [mocha](http://mochajs.org/) and [Should.js](http://shouldjs.github.io/) in order to be assured that our implementation
of functions properly.

To run the tests for bigdiff-code simply run:

```shell
$ make test
```

## Style guide
You will want to understand and follow the style guides listed below.
* [npm](https://docs.npmjs.com/misc/coding-style)

Otherwise, we will follow the style guides listed below.
* [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

Also, if you commit contains just minor changes such as fixing typo or following style guide, the commit message needs to have `CLN:` prefix.

```shell
CLN: describe about typo or style guide

Bla Bla Bla~
```
