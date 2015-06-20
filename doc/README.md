# Documentation for bigdiff-code
## Quick Setup
If you want to run `bigdiff-code` on ubuntu 14.04 LTS, you can do it within 15 minutes with the following steps. I have tested it on a Google Compute Engine instance which has n1-standard-2 (2 vCPUs, 7.5 GB memory) with 200GB HDD.

### Steps
* [Install mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/).
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```
* Install build tools for [BSON extensions of mongoDB](http://stackoverflow.com/questions/21656420/failed-to-load-c-bson-extension).
```
sudo apt-get install gcc make build-essential`
```
* Install [NVM](https://github.com/creationix/nvm) to use node and npm.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
exec $SHELL
nvm install stable
nvm use stable
```
* Install git
```
sudo apt-get install git
```
* Clone bigdiff-code
```
git clone https://github.com/sangheestyle/bigdiff-code
```
* Config mongodb for bigdiff-code
```
cd bigdiff-code
mongo test config/mongo/init.js
```
* Install npm packages for bigdiff-code
```
cd bigdiff-code
npm install
```
* Modify config
  * Check [Modify configuration of bigdiff-code](https://github.com/sangheestyle/bigdiff-code/tree/master/doc#modify-configuration-of-bigdiff-code).
* Run web service and cron jobs
```
cd bigdiff-code
npm install -g forever
forever start app.js
forever start cron.js
```

Done! The app will run forever even you close your session. If you want to stop all the node programs run by `forever`, you just need to do `forever stopall`.

### Services

* Do cron jobs: See [related code](https://github.com/sangheestyle/bigdiff-code/blob/master/cron.js) and find `jobSearchRepos` and `jobCloneRepos` to understand how they do cron.
  * Search repos on github at 00:00:01am on everyday.
  * Clone repos at 00:00:01am on everyday.
* Do web service at http://localhost:8080
  * Search patterns: http://localhost:8080/search/commits
  * Show trend: http://localhost:8080/dashboard

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
You need to copy config template file and modify copied one.

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

Especially, you have to create an empty folder which all the cloned repositories will be under, and you need to register path of this folder in `local_repo_root`. It will be created automatically if there has no such `local_repo_root` folder, but you can avoid some potential problems with creating a folder on your own.

Also, I used personal access tokens (faked one) instead of github_password. This is because I strongly recommend you to use [an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) instead of github password.

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
