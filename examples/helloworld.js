var c = require('../lib/fetch')
var f = require('../lib/find')

c.fetch('mini')
var r = f.findCommitByKeywords(['bug'])
console.log(r)
