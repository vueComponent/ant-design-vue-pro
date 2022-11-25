# Changes to Selector Specificity

### 2.0.2 (June 8, 2022)

- Fix case insensitive matching.

### 2.0.1 (June 10, 2022)

- Fixed: Exception on `:nth-child` without arguments. [#439](https://github.com/csstools/postcss-plugins/issues/439)

### 2.0.0 (June 4, 2022)

- Breaking: use only named exports instead of `default`
- Added: `compare(a, b)` function to compare selectors by specificity

```diff
- `import selectorSpecificity from '@csstools/selector-specificity';`
+ `import { selectorSpecificity } from '@csstools/selector-specificity';`
```

### 1.0.0 (April 26, 2022)

- Initial version
