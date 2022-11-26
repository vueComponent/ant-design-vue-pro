# stylelint-config-standard

[![NPM version](https://img.shields.io/npm/v/stylelint-config-standard.svg)](https://www.npmjs.org/package/stylelint-config-standard) [![Build Status](https://github.com/stylelint/stylelint-config-standard/workflows/CI/badge.svg)](https://github.com/stylelint/stylelint-config-standard/actions)

> The standard shareable config for Stylelint.

Extends [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended).

Turns on additional rules to enforce common conventions found in the specifications and in a handful of CSS styleguides, including: [The Idiomatic CSS Principles](https://github.com/necolas/idiomatic-css),
[Google's CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html#CSS_Formatting_Rules), [Airbnb's Styleguide](https://github.com/airbnb/css#css), and [@mdo's Code Guide](https://codeguide.co/#css).

It favours flexibility over strictness for things like multi-line lists and single-line rulesets.

To see the rules that this config uses, please read the [config itself](./index.js).

## Example

<!-- prettier-ignore -->
```css
@import url("x.css");
@import url("y.css");

/**
 * Multi-line comment
 */

:root {
  --brand-red: hsl(5deg 10% 40%);
}

.selector-1,
.selector-2,
.selector-3[type="text"] {
  background: linear-gradient(#fff, rgb(0 0 0 / 80%));
  box-sizing: border-box;
  display: block;
  color: var(--brand-red);
}

.selector-a,
.selector-b:not(:first-child) {
  padding: 10px !important;
  top: calc(100% - 2rem);
}

.selector-x { width: 10%; }
.selector-y { width: 20%; }
.selector-z { width: 30%; }

/* Single-line comment */

@media (width >= 60em) {
  .selector {
    /* Flush to parent comment */
    transform: translate(1, 1) scale(3);
  }
}

@media (orientation: portrait), projection and (color) {
  .selector-i + .selector-ii {
    background: hsl(20deg 25% 33%);
    font-family: Helvetica, "Arial Black", sans-serif;
  }
}

/* Flush single line comment */
@media
  screen and (min-resolution: 192dpi),
  screen and (min-resolution: 2dppx) {
  .selector {
    animation: 3s none fade-in;
    background-image:
      repeating-linear-gradient(
        -45deg,
        transparent,
        #fff 25px,
        rgb(255 255 255 / 100%) 50px
      );
    margin: 10px;
    margin-bottom: 5px;
    box-shadow:
      0 1px 1px #000,
      0 1px 0 #fff,
      2px 2px 1px 1px #ccc inset;
    height: 10rem;
  }

  /* Flush nested single line comment */
  .selector::after {
    content: "→";
    background-image: url("x.svg");
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

_Note: the config is tested against this example, as such the example contains plenty of CSS syntax, formatting and features._

## Installation

```bash
npm install stylelint-config-standard --save-dev
```

## Usage

Set your stylelint config to:

```json
{
  "extends": "stylelint-config-standard"
}
```

### Extending the config

Add a `"rules"` key to your config, then add your overrides and additions there.

You can turn off rules by setting its value to `null`. For example:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": null
  }
}
```

Or lower the severity of a rule to a warning using the `severity` secondary option. For example:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "property-no-vendor-prefix": [
      true,
      {
        "severity": "warning"
      }
    ]
  }
}
```

A more complete example, to change the `at-rule-no-unknown` rule to use its `ignoreAtRules` option, change the `indentation` to tabs, turn off the `number-leading-zero` rule, set the severity of the `number-max-precision` rule to `warning`, and add the `unit-allowed-list` rule:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["--my-at-rule"]
      }
    ],
    "indentation": "tab",
    "number-leading-zero": null,
    "number-max-precision": [
      4,
      {
        "severity": "warning"
      }
    ],
    "unit-allowed-list": ["em", "rem", "s"]
  }
}
```

#### Suggested additions

`stylelint-config-standard` is a great foundation for your own config. You can extend it to create a tailored and much stricter config:

- Manage specificity using:
  - [`max-nesting-depth`](https://github.com/stylelint/stylelint/blob/main/lib/rules/max-nesting-depth/README.md)
  - [`selector-max-attribute`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-attribute/README.md)
  - [`selector-max-class`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-class/README.md)
  - [`selector-max-combinators`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-combinators/README.md)
  - [`selector-max-compound-selectors`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-compound-selectors/README.md)
  - [`selector-max-id`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-id/README.md)
  - [`selector-max-pseudo-class`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-pseudo-class/README.md)
  - [`selector-max-specificity`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-specificity/README.md)
  - [`selector-max-type`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-type/README.md)
  - [`selector-max-universal`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-max-universal/README.md)
  - [`selector-no-qualifying-type`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-no-qualifying-type/README.md)
- Specify acceptable selector types, units, properties, functions and words in comments using:
  - [`at-rule-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/at-rule-disallowed-list/README.md)
  - [`at-rule-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/at-rule-allowed-list/README.md)
  - [`at-rule-property-required-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/at-rule-property-required-list/README.md)
  - [`color-named`](https://github.com/stylelint/stylelint/blob/main/lib/rules/color-named/README.md)
  - [`color-no-hex`](https://github.com/stylelint/stylelint/blob/main/lib/rules/color-no-hex/README.md)
  - [`comment-word-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/comment-word-disallowed-list/README.md)
  - [`declaration-no-important`](https://github.com/stylelint/stylelint/blob/main/lib/rules/declaration-no-important/README.md)
  - [`declaration-property-unit-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/declaration-property-unit-disallowed-list/README.md)
  - [`declaration-property-unit-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/declaration-property-unit-allowed-list/README.md)
  - [`declaration-property-value-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/declaration-property-value-disallowed-list/README.md)
  - [`declaration-property-value-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/declaration-property-value-allowed-list/README.md)
  - [`function-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/function-disallowed-list/README.md)
  - [`function-url-scheme-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/function-url-scheme-disallowed-list/README.md)
  - [`function-url-scheme-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/function-url-scheme-allowed-list/README.md)
  - [`function-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/function-allowed-list/README.md)
  - [`media-feature-name-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/media-feature-name-disallowed-list/README.md)
  - [`media-feature-name-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/media-feature-name-allowed-list/README.md)
  - [`property-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/property-disallowed-list/README.md)
  - [`property-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/property-allowed-list/README.md)
  - [`selector-attribute-operator-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-attribute-operator-disallowed-list/README.md)
  - [`selector-attribute-operator-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-attribute-operator-allowed-list/README.md)
  - [`selector-combinator-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-combinator-disallowed-list/README.md)
  - [`selector-combinator-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-combinator-allowed-list/README.md)
  - [`selector-pseudo-class-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-pseudo-class-disallowed-list/README.md)
  - [`selector-pseudo-class-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-pseudo-class-allowed-list/README.md)
  - [`selector-pseudo-element-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-pseudo-element-disallowed-list/README.md)
  - [`selector-pseudo-element-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-pseudo-element-allowed-list/README.md)
  - [`unit-disallowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/unit-disallowed-list/README.md)
  - [`unit-allowed-list`](https://github.com/stylelint/stylelint/blob/main/lib/rules/unit-allowed-list/README.md)
- Specify acceptable patterns using:
  - [`selector-nested-pattern`](https://github.com/stylelint/stylelint/blob/main/lib/rules/selector-nested-pattern/README.md)
- Specify a notation for font weights using:
  - [`font-weight-notation`](https://github.com/stylelint/stylelint/blob/main/lib/rules/font-weight-notation/README.md)
- Specify what types of URLs are allowed using:
  - [`function-url-no-scheme-relative`](https://github.com/stylelint/stylelint/blob/main/lib/rules/function-url-no-scheme-relative/README.md)

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
