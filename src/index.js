let observer
const observing = []

function onIntersect(entries) {
  entries.forEach(entry => {
    const item = find(entry.target)
    item.ratio = entry.intersectionRatio
  })

  checkActive()
}

function checkActive() {
  observing.sort((a, b) => b.ratio - a.ratio)
  const max = observing[0].ratio

  if (max === 0) {
    return
  }

  const items = observing.filter(item => item.ratio === max)

  let active

  if (items.length === 1) {
    active = items[0]
  } else {
    active = items.sort((a, b) => a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)[0]
  }

  active.cb.forEach(cb => cb(active.el))
}

function find(el) {
  return observing.find(item => item.el === el)
}

function findIndex(el) {
  return observing.findIndex(item => item.el === el)
}

export function observe(el, cb) {
  if (!observer) {
    const threshold = []

    for (let i = 0; i <= 1; i += 0.01) {
      threshold.push(i)
    }

    observer = new IntersectionObserver(onIntersect, { threshold })
  }

  const existing = find(el)

  if (existing) {
    if (!existing.cb.includes(cb)) {
      existing.cb.push(cb)
    }
  } else {
    observing.push({ el, cb: [cb], ratio: 0 })
    observer.observe(el)
  }
}

export function unobserve(el, cb) {
  const i = findIndex(el)

  if (i === -1) {
    return
  }

  const item = observing[i]
  item.cb = cb ? item.cb.filter(c => c !== cb) : []

  if (!item.cb.length) {
    observer.unobserve(item.el)
    observing.splice(i, 1)

    if (!observing.length) {
      observer.disconnect()
      observer = null
    }
  }
}

export default { observe, unobserve }
