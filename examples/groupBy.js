var mongo = require('../lib/mongo');
var config = require('../config.json');

var group =
  [
    {
      $group: {
        _id: {
          year: {$year: "$created_at"},
          month: {$month: "$created_at"},
          day: {$dayOfMonth: "$created_at"}},
        count: {$sum: 1}
      }
    }
  ];
var params = { url: config.mongo_url
             , collection: config.mongo_collection
             , group: group
};

mongo.group(params, function(err, result) {
  var jsonResult =  []
  result.forEach(function(entry) {
    var date = entry._id.year + "-" + entry._id.month + "-" + entry._id.day;
    date = new Date(Date.parse(date)).toISOString().slice(0, 10);
    jsonResult.push({date: date, count: entry.count});
  });
  console.log(jsonResult);
  console.log(jsonResult.length + " items");
});
