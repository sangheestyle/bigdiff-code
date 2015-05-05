# bigdiff-code
You can find what we need to do in [issue](https://github.com/sangheestyle/bigdiff-code/issues).

## Setup
To setup the environment, run:
```shell
$ git clone https://github.com/sangheestyle/bigdiff-code
$ cd bigdiff-code
$ npm install
```
Also, bigdiff-code is installable via [npm](https://www.npmjs.com/package/bigdiff-code).

## How to use
You can see some [example](https://github.com/sangheestyle/bigdiff-code/tree/master/examples) to know how to use this module.

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
- [x] `github.searchRepos`: search repos and save result in DB.

### googlePlay
Search packages, crawl their information, and save them.
- [x] getReviews: crawl reviews of app.
- [ ] isExisted: check a app whether existed or not in Google Play with package ID.

### utils
Some utils help other modules.
- [x] `utils.dateRange`: generate date range between start and end date.

## Style guide
You will want to understand and follow the style guides listed below.
* [express](https://github.com/strongloop/express)
* [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
