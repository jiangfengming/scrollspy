var observer;
var observing = [];

function onIntersect(entries) {
  entries.forEach(function (entry) {
    var item = find(entry.target);
    item.ratio = entry.intersectionRatio;
  });
  checkActive();
}

function checkActive() {
  observing.sort(function (a, b) {
    return b.ratio - a.ratio;
  });
  var max = observing[0].ratio;

  if (max === 0) {
    return;
  }

  var items = observing.filter(function (item) {
    return item.ratio === max;
  });
  var active;

  if (items.length === 1) {
    active = items[0];
  } else {
    active = items.sort(function (a, b) {
      return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    })[0];
  }

  active.cb.forEach(function (cb) {
    return cb(active.el);
  });
}

function find(el) {
  return observing.find(function (item) {
    return item.el === el;
  });
}

function findIndex(el) {
  return observing.findIndex(function (item) {
    return item.el === el;
  });
}

function observe(el, cb) {
  if (!observer) {
    var threshold = [];

    for (var i = 0; i <= 1; i += 0.01) {
      threshold.push(i);
    }

    observer = new IntersectionObserver(onIntersect, {
      threshold: threshold
    });
  }

  var existing = find(el);

  if (existing) {
    if (!existing.cb.includes(cb)) {
      existing.cb.push(cb);
    }
  } else {
    observing.push({
      el: el,
      cb: [cb],
      ratio: 0
    });
    observer.observe(el);
  }
}
function unobserve(el, cb) {
  var i = findIndex(el);

  if (i === -1) {
    return;
  }

  var item = observing[i];
  item.cb = cb ? item.cb.filter(function (c) {
    return c !== cb;
  }) : [];

  if (!item.cb.length) {
    observer.unobserve(item.el);
    observing.splice(i, 1);

    if (!observing.length) {
      observer.disconnect();
      observer = null;
    }
  }
}
var index = {
  observe: observe,
  unobserve: unobserve
};

export default index;
export { observe, unobserve };
