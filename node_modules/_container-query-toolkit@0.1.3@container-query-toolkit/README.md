# container-query-toolkit

:wrench: Basic utilities to work with container query.

## Install

```
npm i -S container-query-toolkit
```

## Usage

```js
const kit = require('container-query-toolkit');
// or
import * as kit from 'container-query-toolkit';
// or
import {matchQueries} from 'container-query-toolkit';
// or
import matchQueries from 'container-query-toolkit/lib/matchQueries';

const query = {
  a: {minWidth: 400, maxWidth: 500, minHeight: 400, maxHeight: 500},
  b: {minWidth: 500, maxWidth: 600, minHeight: 400, maxHeight: 500},
  c: {minWidth: 400, maxWidth: 500, minHeight: 500, maxHeight: 600},
  d: {minWidth: 500, maxWidth: 600, minHeight: 500, maxHeight: 600},
};

const result1 = matchQueries(query)({width: 300, height: 300});
expect(result1).toEqual({a: false, b: false, c: false, d: false});

const result2 = matchQueries(query)({width: 450, height: 450});
expect(result2).toEqual({a: true, b: false, c: false, d: false});

const result3 = matchQueries(query)({width: 450, height: 550});
expect(result3).toEqual({a: false, b: false, c: true, d: false});

const result4 = matchQueries(query)({width: 550, height: 450});
expect(result4).toEqual({a: false, b: true, c: false, d: false});

const result5 = matchQueries(query)({width: 550, height: 550});
expect(result5).toEqual({a: false, b: false, c: false, d: true});

const result6 = matchQueries(query)({width: 700, height: 700});
expect(result6).toEqual({a: false, b: false, c: false, d: false});

// {min|max}Height would be ignored if height is not provided.
const result7 = matchQueries(query)({width: 450});
expect(result7).toEqual({a: true, b: false, c: true, d: false});

// {min|max}Width would be ignored if width is not provided.
const result8 = matchQueries(query)({height: 450});
expect(result8).toEqual({a: true, b: true, c: false, d: false});
```

## API

### `matchQueries(rules)(contentSize)`

- `rules: {[key: string]: {minWidth?: number, maxWidth?: number, minHeight?: number, maxHeight?: number}}`

- `contentSize: {height?: number, width?: number}`

	If `contentSize` is missing `height` or `width`, `{min|max}Height` or `{min|max}Width` rules will be ignored respectively.
