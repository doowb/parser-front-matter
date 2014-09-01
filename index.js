'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var matter = require('gray-matter');
var utils = require('parser-utils');


/**
 * Front matter parser
 */

var parser = module.exports;


/**
 * Parse the given `file` into a normalized `file` object and callback `next(err, file)`.
 * Options are passed to [gray-matter], and if `options` has a `locals` property, it
 * will be merged with the `data` property on the normalized `file` object.
 *
 * Normalized `file` objects should have the following properties:
 *
 *   - `path` The source file path, if provided
 *   - `data`: metadata, from yaml front matter and/or locals
 *   - `content`: the content of a file, excluding front-matter
 *   - `orig`: the original content of a file, including front-matter
 *
 * @param {String|Object} `file` The object or string to parse.
 * @param {Object|Function} `options` or `next` callback function.
 * @param {Function} `next` callback function.
 * @api public
 */

parser.parse = function matterParse(file, options, next) {
  if (typeof options === 'function') {
    next = options;
    options = {};
  }

  var opts = _.extend({}, options);
  var o = {};

  if (typeof file === 'string') {
    o.content = file;
  } else {
    o = file;
  }

  var res = matter(o.content, opts);
  _.merge(o, res);

  try {
    next(null, utils.extendFile(o, opts));
  } catch (err) {
    next(err);
    return;
  }
};


/**
 * Parse the given `file` and return a normalized `file` object,
 * with `data`, `content`, `path` and `orig` properties.
 *
 * @param {String|Object} `file` The object or string to parse.
 * @param {Object} `options` to pass to [gray-matter].
 * @api public
 */

parser.parseSync = function matterParseSync(file, options) {
  var opts = _.extend({}, options);
  var o = {};

  if (typeof file === 'string') {
    o.content = file;
  } else {
    o = file;
  }

  try {
    var res = matter(o.content, opts);
    _.merge(o, res);

    return utils.extendFile(o, opts);
  } catch (err) {
    return err;
  }
};
