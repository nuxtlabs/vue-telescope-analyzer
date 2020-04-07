const asArray = (value) => value instanceof Array ? value : [value]
exports.asArray = asArray

// Src: https://github.com/AliasIO/wappalyzer/blob/master/src/wappalyzer.js
exports.parsePatterns = function (patterns) {
  if (!patterns) {
    return [];
  }

  let parsed = {};

  // Convert string to object containing array containing string
  if (typeof patterns === 'string' || patterns instanceof Array) {
    patterns = {
      main: asArray(patterns),
    };
  }

  Object.keys(patterns).forEach((key) => {
    parsed[key] = [];

    asArray(patterns[key]).forEach((pattern) => {
      const attrs = {};

      pattern.split('\\;').forEach((attr, i) => {
        if (i) {
          // Key value pairs
          attr = attr.split(':');

          if (attr.length > 1) {
            attrs[attr.shift()] = attr.join(':');
          }
        } else {
          attrs.string = attr;

          try {
            attrs.regex = new RegExp(attr.replace('/', '\/'), 'i'); // Escape slashes in regular expression
          } catch (error) {
            attrs.regex = new RegExp();

            this.log(`${error.message}: ${attr}`, 'error', 'core');
          }
        }
      });

      parsed[key].push(attrs);
    });
  });

  // Convert back to array if the original pattern list was an array (or string)
  if ('main' in parsed) {
    parsed = parsed.main;
  }

  return parsed;
}

exports.isCrawlable = async function (htmlHeaders) {
  const tag = htmlHeaders['x-robots-tag']
  const patterns = /noindex|none|nofollow/

  return tag ? !patterns.test(tag) : true
}
