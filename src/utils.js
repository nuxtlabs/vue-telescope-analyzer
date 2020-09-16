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
  const patterns = /noindex|none/

  return tag ? !patterns.test(tag) : true
}

// From https://github.com/alixaxel/chrome-aws-lambda/blob/master/source/index.js#L83
exports.puppeteerArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--disk-cache-size=33554432',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain'
]
exports.puppeteerViewport = {
  deviceScaleFactor: 1,
  hasTouch: false,
  height: 1080,
  isLandscape: true,
  isMobile: false,
  width: 1920,
}
