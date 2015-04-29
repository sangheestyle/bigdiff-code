var gp = require('../lib/googleplay');

var id = "com.github.mobile";
gp.getReviews(id, function(reviews){
  console.log(reviews);
  console.log("## DONE:" + reviews.length + " reviews are fetched " +
              "for " + id);
});
