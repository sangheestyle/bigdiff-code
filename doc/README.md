# Documentation for bigdiff-code

## Setup

### Requirements

* [node.js](https://nodejs.org)
* [npm](https://www.npmjs.com)
* [mongoDB](https://www.mongodb.org)

I recommand you [Node Version Manager](https://github.com/creationix/nvm) to install and manage node.js. Also, it might be helpful to read the followings in order to install and use mongoDB.

* [How to install](http://docs.mongodb.org/manual/installation/)
* [Mongo Shell Quick reference](http://docs.mongodb.org/manual/reference/mongo-shell)

### Clone and install bigdiff-code
Just clone and install.
```shell
$ git clone https://github.com/sangheestyle/bigdiff-code
$ cd bigdiff-code
$ npm install
```

### Run init.js for creating DB and collection
You need to create a DB and collection on your mongoDB instance. Just simply do the following command:

```shell
$ mongo test config/mongo/init.js
```

Now, your mongoDB instance has `muse` for DB and `repo` for collection under `muse`.

### Modify configuration of bigdiff-code
Also, you need to copy config template file and modify copied one.

```shell
$ cp config.json.bak config.json
$ vim config.json
```

For example, I modified like the following:

```json
{ "github_id": "sangheestyle"
, "github_password": "9876543bfbbdf7faabd04c3dccb8e66058b124be"
, "local_repo_root": "/Users/sanghee/Dev/repo"
, "mongo_url": "mongodb://localhost:27017/muse"
, "mongo_collection": "repo"
, "repo": "DO_NOT_CHANGE"
}
```

I used personal access tokens (faked one) instead of github_password. This is because I strongly recommend you to use [an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) instead of github password.

## Run some examples
There are some examples for basic functions. After reviewing them, you can integrate them into your web applications.

### Search repos for github
```shell
$ cd examples
$ node searchRepos.js
```

### Filter and clones
```shell
$ cd examples
$ node searchRepos.js
```

### Search commits
TBD

```shell
$ TBD
```


## REST APIs
TBD

### Search pattern on git repositories.

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
