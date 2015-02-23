# bigdiff-code
You can find what we need to do in [wiki](https://github.com/sangheestyle/bigdiff-code/wiki).

## Submodules and functionalities
The bigdiff-code module will give you submodules for accessing repositories and social artifacts.

### git
Wrap git functionalities.
- [x] `git.log`: do git log with given regular expression.
- [ ] `git.grep`: grep commits by given regular expression and context.
- [x] `git.clone`: clone single repository.
- [x] `git.multipleClone`: clone single or multiple repositories.

### github
Find repositories or issues via various criteria. See [Search APIs](https://developer.github.com/v3/search).
- [x] `github.authClient`: return a client with authentification.
- [x] `github.getRepoIssues`: get issues of a repository and save result in DB.
- [x] `github.searchRepos`: search repos and save result into a JSON file or DB.

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

## Style guide
You will want to understand and follow the style guides listed below.
* [express](https://github.com/strongloop/express)
* [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
