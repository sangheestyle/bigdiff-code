# REST APIs

## Search pattern on git repositories.

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
