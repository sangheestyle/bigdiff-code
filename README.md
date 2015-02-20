# bigdiff-code
You can find what we need to do in [wiki](https://github.com/sangheestyle/bigdiff-code/wiki).

## Submodules and functionalities
The bigdiff-code module will give you submodules for accessing repositories and social artifacts.

### git
Wrap git functionalities.
- [x] `git.log`: do git log with given regular expression.
- [ ] `git.grep`: grep commits by given regular expression and context.
- [x] `git.clone`: clone single or multiple repositories.

### github
Find repositories or issues via various criteria. See [Search APIs](https://developer.github.com/v3/search).
- [x] `github.searchRepos`: search repos and save result into a JSON file or DB.
- [ ] `github.getCommits`: get commits of a repository.
- [ ] `github.getIssues`: get issues of a repository.

### queryResult
View, filter, and export queryResult.
- [ ] viewSummary
- [ ] filterBy
- [ ] export

### searcher
Search things on github(remote) or git(local) by key
- [ ] searchCommitsByKeyword
- [ ] searchIssuesByKeyword
- [ ] searchSourceDiff

### googlePlay
Search packages, crawl their information, and save them.
- [ ] isExisted: check a app whether existed or not in Google Play with package ID
- [ ] crawlInformation: crawl information of the app and save it into DB

### utils
Some utils help other modules.
- [x] `utils.dateRange`: generate date range between start and end date.

## Setup
To setup the environment, run:
```shell
$ git clone https://github.com/sangheestyle/bigdiff-code
$ cd bigdiff-code
$ nvm install
$ make test
```
## Testing
We use [mocha](http://mochajs.org/) and [Should.js](http://shouldjs.github.io/) in order to be assured that our implementation
of functions properly.

To run the tests for bigdiff-code simply run:

```shell
$ make test
```

Also, we can use web server for testing our REST API.

``` shell
$ curl -d '{"regex":"SetTag"}' -H "Content-Type: application/json" http://sangheestyle.com/search/git
{"regex":"SetTag",
 "repos":[{"name":"repo1",
           "commits":[{"sha":"1a2e3","patch":"bla~"},
                      {"sha":"2klj3","patch":"blam~"}]},
          {"name":"repo2",
           "commits":[{"sha":"4a2e3","patch":"bla~"},
                      {"sha":"7klj3","patch":"blam~"}]}]
}
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
