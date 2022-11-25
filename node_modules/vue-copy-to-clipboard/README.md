vue-copy-to-cliboard
----

Copy to clipboard Vue component

### Use

```bash
$ npm install vue-copy-to-clipboard
or
$ yarn add vue-copy-to-clipboard
```
 

### Examples

```jsx
// by jsx
import CopyToClipboard from 'vue-copy-to-clipboard'

export default {
  data () {
    return {
      text: 'is copy content'
    }
  },
  render (h) {
    return (
      <div>
        <CopyToClipboard text={this.text} onCopy={(result) => {
          console.log('onCopy', result)
        }}>
          <Button>Copy to Clipboard</Button>
        </CopyToClipboard>
      </div>
    )
  }
}
```

```vue
<template>
  <div>
    <copy-to-clipboard :text="text" @copy="handleCopy">
      <a-button>Copy to Clipboard</a-button>
    </copy-to-clipboard>
  </div>
</template>

<script>
// by template.vue
import CopyToClipboard from 'vue-copy-to-clipboard'

export default {
  components: {
    CopyToClipboard
  },
  data () {
    return {
      text: '这里可以动态生成内容'
    }
  },
  methods: {
    handleCopy (result) {
      console.log('onCopy', result)
    }
  }
}
</script>
```
