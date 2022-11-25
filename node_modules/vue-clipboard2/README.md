# vue-clipboard2

A simple vuejs 2 binding for clipboard.js

## Install

`npm install --save vue-clipboard2` or use `dist/vue-clipboard.min.js` without webpack

## Usage

For vue-cli user:

```javascript
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
```

For standalone usage:

```html
<script src="vue.min.js"></script>
<!-- must place this line after vue.js -->
<script src="dist/vue-clipboard.min.js"></script>
```

## I want to copy texts without a specific button!

Yes, you can do it by using our new method: `this.$copyText`. See
[sample2](https://github.com/Inndy/vue-clipboard2/blob/master/sample2.html),
where we replace the clipboard directives with a v-on directive.

Modern browsers have some limitations like that you can't use `window.open` without a user interaction.
So there's the same restriction on copying things! Test it before you use it. Make sure you are not
using this method inside any async method.

Before using this feature, read:
[this issue](https://github.com/zenorocha/clipboard.js/issues/218) and
[this page](https://github.com/zenorocha/clipboard.js/wiki/Known-Limitations) first.

## It doesn't work with bootstrap modals

See [clipboardjs](https://clipboardjs.com/#advanced-usage) document and [this pull request](https://github.com/Inndy/vue-clipboard2/pull/23), `container` option is available like this:

```js
let container = this.$refs.container
this.$copyText("Text to copy", container)
```

Or you can let `vue-clipboard2` set `container` to current element by doing this:

```js
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
```

## Sample

```html
<div id="app"></div>

<template id="t">
  <div class="container">
    <input type="text" v-model="message">
    <button type="button"
      v-clipboard:copy="message"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">Copy!</button>
  </div>
</template>

<script>
new Vue({
  el: '#app',
  template: '#t',
  data: function () {
    return {
      message: 'Copy These Text'
    }
  },
  methods: {
    onCopy: function (e) {
      alert('You just copied: ' + e.text)
    },
    onError: function (e) {
      alert('Failed to copy texts')
    }
  }
})
</script>
```

## Sample 2

```html
<div id="app"></div>

  <template id="t">
    <div class="container">
    <input type="text" v-model="message">
    <button type="button" @click="doCopy">Copy!</button>
    </div>
  </template>

  <script>
  new Vue({
    el: '#app',
    template: '#t',
    data: function () {
      return {
        message: 'Copy These Text'
      }
    },
    methods: {
      doCopy: function () {
        this.$copyText(this.message).then(function (e) {
          alert('Copied')
          console.log(e)
        }, function (e) {
          alert('Can not copy')
          console.log(e)
        })
      }
    }
  })
  </script>

```

You can use [your Vue instance ```vm.$el```](https://vuejs.org/v2/api/#vm-el) to get DOM elements via the usual traversal methods, e.g.:

```this.$el.children[1].children[2].textContent```

This will allow you to access the *rendered* content of your components, rather than the components themselves.

### Contribution

PRs welcome, and issues as well! If you want any feature that we don't have currently,
please fire an issue for a feature request.

### License

[MIT License](https://github.com/Inndy/vue-clipboard2/blob/master/LICENSE)
