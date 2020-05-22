const keywords = ['cookie', 'tracking', 'gdpr', 'consent']

function findCookieBanners() {
  let banners = []
  keywords.forEach(keyword => {
    banners.push(...findCookieBannersByKeyword(keyword))
  })
  return banners.filter(b => b)
}
function findCookieBannersByKeyword(keyword) {
  return [...document.getElementsByTagName('*')]
    .filter(candidate => matchesKeyword(candidate, keyword))
    .map(match => findCookieBannerContainer(match))
    .filter(container => container)
}
function findCookieBannerContainer(candidate) {
  if (candidate) {
    return isBannerContainer(candidate)
      ? candidate
      : findCookieBannerContainer(candidate.parentElement)
  }
}

function matchesKeyword(candidate, keyword) {
  return classMatchesKeyword(candidate, keyword)
    || idMatchesKeyword(candidate, keyword)
    || textContentMatchesKeyword(candidate, keyword)
}
function classMatchesKeyword(candidate, keyword) {
  return candidate.className
    && candidate.className.toLowerCase
    && candidate.className.toLowerCase().includes(keyword)
}
function idMatchesKeyword(candidate, keyword) {
  return candidate.id
    && candidate.id.toLowerCase
    && candidate.id.toLowerCase().includes(keyword)
}
function textContentMatchesKeyword(candidate, keyword) {
  return candidate.innerText
    && candidate.innerText.toLowerCase().includes(keyword)
    && isKeywordLeaf(candidate, keyword)
}
function isKeywordLeaf(candidate, keyword) {
  return [...candidate.children].filter(child => child.innerText && child.innerText.includes(keyword)).length == 0
}
function isBannerContainer(candidate) {
  return candidate
    && parseInt(getComputedStyle(candidate)['z-index'])
    && (
      getComputedStyle(candidate).position == 'fixed'
      || getComputedStyle(candidate).position == 'relative'
      || getComputedStyle(candidate).position == 'absolute'
    )
}

function removeCookieBanners() {
  findCookieBanners()
    .filter(banner => banner)
    .forEach(banner => {
      banner.remove()
    })
}

// immediate execution
removeCookieBanners()

// for lazy loaded cookie consent plugins
setTimeout(function () {
  removeCookieBanners()
}, 250)
setTimeout(function () {
  removeCookieBanners()
}, 3000)
