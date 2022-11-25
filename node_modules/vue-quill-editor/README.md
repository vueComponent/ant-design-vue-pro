[![GitHub stars](https://img.shields.io/github/stars/surmon-china/vue-quill-editor.svg?style=flat-square)](https://github.com/surmon-china/vue-quill-editor/stargazers)
[![Build Status](https://travis-ci.org/surmon-china/vue-quill-editor.svg?branch=master)](https://travis-ci.org/surmon-china/vue-quill-editor)
[![GitHub issues](https://img.shields.io/github/issues/surmon-china/vue-quill-editor.svg?style=flat-square)](https://github.com/surmon-china/vue-quill-editor/issues)
[![GitHub forks](https://img.shields.io/github/forks/surmon-china/vue-quill-editor.svg?style=flat-square)](https://github.com/surmon-china/vue-quill-editor/network)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat-square)](https://github.com/surmon-china/vue-quill-editor)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/surmon-china/vue-quill-editor)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/surmon-china/vue-quill-editor.svg?style=flat-square)](https://twitter.com/intent/tweet?url=https://github.com/surmon-china/vue-quill-editor)
[![](https://badge.juejin.im/entry/5852b6fc61ff4b006c89b49d/likes.svg?style=flat-square)](https://juejin.im/entry/5852b6fc61ff4b006c89b49d/detail)

[![NPM](https://nodei.co/npm/vue-quill-editor.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vue-quill-editor/)
[![NPM](https://nodei.co/npm-dl/vue-quill-editor.png?months=9&height=3)](https://nodei.co/npm/vue-quill-editor/)


# Vue-Quill-Editor
🍡Quill editor component for Vue, support SPA and SSR.

基于 Quill、适用于 Vue 的富文本编辑器，支持服务端渲染和单页应用。


## Example

[Demo Page](https://surmon-china.github.io/vue-quill-editor/)

[CDN Example](https://jsfiddle.net/tng9r8j3/)

[Nuxt.js/SSR example code](https://github.com/surmon-china/vue-quill-editor/blob/master/examples/nuxt-ssr-example)

#### Projects Using Vue-Quill-Editor
[Tamiat CMS](https://github.com/tamiat/tamiat/)


## Install

#### CDN

``` html
<link rel="stylesheet" href="path/to/quill.core.css"/>
<link rel="stylesheet" href="path/to/quill.snow.css"/>
<link rel="stylesheet" href="path/to/quill.bubble.css"/>
<script type="text/javascript" src="path/to/quill.js"></script>
<script type="text/javascript" src="path/to/vue.min.js"></script>
<script type="text/javascript" src="path/to/dist/vue-quill-editor.js"></script>
<script type="text/javascript">
  Vue.use(window.VueQuillEditor)
</script>
```

#### NPM

``` bash
npm install vue-quill-editor --save
```

### Mount

#### mount with global

``` javascript
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)
```

#### mount with component

```javascript
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  }
}
```

#### mount with ssr

```javascript
// if used in nuxt.js/ssr, you should keep require it only in browser build environment
if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor, /* { default global options } */)
}
```

#### register quill module

```javascript
// register quill modules, you need to introduce and register before the vue program is instantiated
import Quill from 'quill'
import yourQuillModule from '../yourModulePath/yourQuillModule.js'
Quill.register('modules/yourQuillModule', yourQuillModule)
```

### Difference（使用方法的区别）

**SSR and the only difference in the use of the SPA:**
- SPA worked by the `component`, find quill instance by `ref attribute`.
- SSR worked by the `directive`, find quill instance by `directive arg`.
- Other configurations, events are the same.

### SSR

``` vue
<!-- You can custom the "myQuillEditor" name used to find the quill instance in current component -->
<template>
  <!-- bidirectional data binding（双向数据绑定） -->
  <div class="quill-editor" 
       v-model="content"
       v-quill:myQuillEditor="editorOption">
  </div>

  <!-- Or manually control the data synchronization（手动控制数据流）  -->
  <div class="quill-editor" 
       :content="content"
       @change="onEditorChange($event)"
       v-quill:myQuillEditor="editorOption">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        content: '<p>example content</p>',
        editorOption: { /* quill options */ }
      }
    },
    mounted() {
      console.log('this is current quill instance object', this.myQuillEditor)
    },
    methods: {
      onEditorChange(event) {
        console.log('onEditorChange')
      }
    },
    // Omit the same parts as in the following component sample code
    // ...
  }
</script>
```


### SPA

``` vue
<template>
  <!-- bidirectional data binding（双向数据绑定） -->
  <quill-editor v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
  </quill-editor>

  <!-- Or manually control the data synchronization（或手动控制数据流） -->
  <quill-editor :content="content"
                :options="editorOption"
                @change="onEditorChange($event)">
  </quill-editor>
</template>

<script>

  // you can also register quill modules in the component
  import Quill from 'quill'
  import { someModule } from '../yourModulePath/someQuillModule.js'
  Quill.register('modules/someModule', someModule)
  
  export default {
    data () {
      return {
        content: '<h2>I am Example</h2>',
        editorOption: {
          // some quill options
        }
      }
    },
    // manually control the data synchronization
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        this.content = html
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
      console.log('this is current quill instance object', this.editor)
    }
  }
</script>
```


## Modules
- [quill-image-extend-module](https://github.com/NextBoy/quill-image-extend-module)
- [quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module)
- [quill-image-drop-module](https://github.com/kensnyder/quill-image-drop-module)
- [quilljs-table](https://github.com/dost/quilljs-table)
- [more modules...](https://github.com/search?o=desc&q=quill+module&s=stars&type=Repositories&utf8=%E2%9C%93)


## Issues
- [Add attributes from toolbar options](https://github.com/quilljs/quill/issues/1084)
- [Option to insert an image from a URL](https://github.com/quilljs/quill/issues/893)
- [How vue-quill-editor combine with the syntax highlighter module of highlight.js](https://github.com/surmon-china/vue-quill-editor/issues/39)
- [配合 element-ui 实现上传图片/视频到七牛 demo](https://github.com/surmon-china/vue-quill-editor/issues/102)
- [How to fix “Can’t find variable: Quill”, “Quill is undefined”, “window.Quill is undefined” errors when trying to use Quill modules that use Webpack in Nuxt/SSR](https://github.com/surmon-china/vue-quill-editor/issues/171#issuecomment-370253411)


## Quill documents
[Api docs](https://quilljs.com/docs/quickstart/)


## Author
[Surmon](https://surmon.me)
