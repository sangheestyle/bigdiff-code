# bigdiff-code
You can find what we need to do in [issue](https://github.com/sangheestyle/bigdiff-code/issues). Also, you can see [a simple example](http://sangheestyle.com:8080/dashboard) of this implementation.

## Setup
To setup the environment, run:
```shell
$ git clone https://github.com/sangheestyle/bigdiff-code
$ cd bigdiff-code
$ npm install
```
Also, you need to copy config template file and modify it.
```shell
$ cp config.json.bak config.json
```
We strongly recommend you to use [an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) instead of github password.

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

## REST APIs
### POST api/search/commits
Search regex for commits with some params. [example](https://gist.github.com/sangheestyle/3d6c3e7cd65e416ac398)
```shell
$ curl -H "Content-Type: application/json" -X POST \
-d '{"regex": ".setTag\\([^,|^\\(]*,[^,]*\\)", "ext":"java", "local_repo_root": "demo_set", "max":100}' \
http://sangheestyle.com:8080/api/search/commits \
-o result.json
```
Params:
* `regex`: regular expression
* `ext`: file extension
* `local_repo_root`: root directory including cloned repos
  * `repos`: root including all the cloned repos
  * `demo_set`: root incuding only some cloned repos
* `max`: max number of result to get limited result

## Style guide
You will want to understand and follow the style guides listed below.
* [express](https://github.com/strongloop/express)
* [node-style-guide](https://github.com/felixge/node-style-guide)
* Javascript: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
