# vue-ref
You can use the callback to get a reference like react.

[![NPM version](https://img.shields.io/npm/v/vue-ref.svg?style=flat)](https://npmjs.org/package/vue-ref) [![NPM downloads](http://img.shields.io/npm/dm/vue-ref.svg?style=flat)](https://npmjs.org/package/vue-ref)

```bash
$ npm install vue-ref --save
```

```js
import ref from 'vue-ref'
Vue.use(ref)
```

```html
<!-- vm.dom will be the DOM node -->
<p v-ref="c => this.dom = c">hello</p>

<!-- vm.child will be the child component instance -->
<child-component v-ref="c => this.child = c"></child-component>

<span v-for="n in 10" :key="n" v-ref="(c, key) => {...}">{{ n }} </span>
```

| Property | Description | Type |
| -------- | ----------- | ---- |
| v-ref | a callback function | function(dom \| vnode, key) |

###
In this callback function, you should not change any reactive data. Otherwise the `render` will enter an infinite loop.
