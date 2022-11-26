# yorkie

> Git hooks made easy

This is a fork of [husky](https://github.com/typicode/husky) with a few changes:

- Prioritizes `package.json` located next to `.git` directory, instead of hard-coded upward search. This avoids the problem when a root package in a lerna monorepo and a sub package both depends on husky, it gets confused and double-updates the root git hooks with wrong paths.

- Changed where hooks are read from in `package.json`:

  **Before**

  ``` json
  {
    "scripts": {
      "precommit": "foo"
    }
  }
  ```

  **After**

  ``` json
  {
    "gitHooks": {
      "pre-commit": "foo"
    }
  }
  ```
