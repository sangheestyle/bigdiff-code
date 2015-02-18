/**
 * Module dependencies.
 */

var moment = require('moment-range');

/**
 * utils prototype.
 */

var utils = exports = module.exports = {};

/**
 * Returns date range between start and end date.
 *
 * @param {String} start
 * @param {String} end
 * @return {moment} range
 * @api public
 */

utils.dateRange = function (start, end) {
  var format = 'YYYY-MM-DD';
  var start = moment(start, format);
  var end = moment(end, format);
  var range = moment().range(start, end);

  return range
};
