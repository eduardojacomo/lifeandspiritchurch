export function getPageRules(page, location) {
  if (page === 'home' && location === 'hero') {
    return {
      maxPerFormat: {
        desktop: 3,
        mobile: 3,
        all: 1
      },
      allowExpired: false
    }
  }

  return {
    maxPerFormat: null
  }
}
