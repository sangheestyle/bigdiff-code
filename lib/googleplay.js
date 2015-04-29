/**
 * * Module dependencies.
 */

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

/**
 * googleplay prototype.
 */

var googleplay = exports = module.exports = {};

/**
 * Get reviews from google play
 *
 * @param {String} username
 * @return {object} client
 * @api public
 */

googleplay.getReviews = function (id, callback) {
  // Set the headers
  var headers = { 'User-Agent': 'Wild/0.0.2'
                , 'Content-Type': 'application/x-www-form-urlencoded'
                }

  // Configure the request
  var options = { url: 'https://play.google.com/store/getreviews'
                , method: 'POST'
                , headers: headers
                , form: { 'reviewType': 0
                        , 'pageNum': 1
                        , 'id': id
                        , 'reviewSortOrder': 2
                        }
                }
  var count = 0;
  var reviews = [];
  // Start the request
  async.forever(function (next) {
    count += 1;
    options.form.pageNum = count;
    console.log(options.form.pageNum);
    request(options, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var htmlString = JSON.parse(body.slice(7, -1))[2];
        $ = cheerio.load(htmlString);
        $('.single-review').each(function(i, elem) {
          // rate should be from 0 - 5
          c1 = '.tiny-star.star-rating-non-editable-container';
          c2 = ' > .current-rating';
          rate = $(c1 + c2, this).css('width').trim();
          rate = parseInt(rate.replace("%", "")) / 20;

          // review-body includes review-title
          reviewTitle = $('.review-title', this).text().trim();
          $('.review-body > .review-title', this).remove();
          $('.review-body > .review-link', this).remove();
          reviewBody = $('.review-body', this).text().trim();

          review = {
            authorName: $('.author-name', this).text().trim(),
            reviewDate: $('.review-date', this).text().trim(),
            reviewId: $('.review-header', this).attr('data-reviewid').trim(),
            rate: rate,
            reviewTitle: reviewTitle,
            reviewBody: reviewBody
          };
          reviews.push(review);
        });
        next();
      } else {
        next('### ERROR: blocked or no data!');
      };
    });
  },
  function () {
    callback(reviews);
  });
};
