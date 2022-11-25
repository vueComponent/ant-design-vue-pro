# vue-container-query

**Totally based on [d6u/react-container-query](https://github.com/d6u/react-container-query).**

## Notice

The following documentation is also originated from [d6u/react-container-query](https://github.com/d6u/react-container-query).

Your suggested to pay a visit to the repo `react-container-query`.

## Installation

```sh
npm i -D vue-container-query
```

## API

### `<container-query :query="query" :initialSize="{ width, height } />`

```html
<template>
  <container-query
    :query="query"
    v-model="params"
    @change="handleChange"
  >
    <pre class="app">{{ params }}</pre>
  </container-query>
</template>

<script>
import { ContainerQuery } from './'

const query = {
  'width-between-400-and-599': {
    minWidth: 400,
    maxWidth: 599
  },
  'width-larger-than-600': {
    minWidth: 600
  }
}

export default {
  components: { ContainerQuery },
  data () {
    return { query, params: {} }
  },
  methods: {
    handleChange () {}
  }
}
</script>
```

#### properties

- `props.children`

  There should only be **one, and exactly one ** child component.

- `props.query`

  "query" is key-value pairs where keys are the class names that will be applied to container element when all constraints are met. The values are the constraints.

- `props.initialSize` (optional)

  `initialSize` is an object with optional `width` or `height` property. Because the limitation on how size is computed based on underlying element, in the initial rendering pass, we don't have the size info (because element must be in the DOM have a valid size). At this time `initialSize` will be used as the size of the element.

### `createContainerQueryMixin(query, initialSize)`

```html

<template>
  <pre class="app">{{ containerQuery }}</pre>
</template>

<script>
import { createContainerQueryMixin } from './'

const query = {
  'width-between-400-and-599': {
    minWidth: 400,
    maxWidth: 599
  },
  'width-larger-than-600': {
    minWidth: 600
  }
}

export default {
  mixins: [
    createContainerQueryMixin(query)
  ]
}
</script>
```
