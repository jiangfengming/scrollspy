# scrollspy

Zero dependencies scrollspy library using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

[Demo](https://jiangfengming.github.io/scrollspy/example.html)

## Install

```
npm install @jfm/scrollspy
```

## Usage

```js
import scrollspy from '@jfm/scrollspy'
// or
// import { observe, unobserve } from '@jfm/scrollspy'

const el = document.getElementById('section')

function callback(el) {
  console.log('scrolled to', el)
}

scrollspy.observe(el, callback)
```

## APIs

### observe

```js
observe(element, callback)
```

Observe the `element`, call the `callback` when it comes into the viewport.
You can call it multiple times with different callbacks.

### unobserve

```js
unobserve(element, [callback])
```

Unobserve the `element` with `callback`. If `callback` is not defined, remove all the callbacks.

## License
[MIT](LICENSE)
