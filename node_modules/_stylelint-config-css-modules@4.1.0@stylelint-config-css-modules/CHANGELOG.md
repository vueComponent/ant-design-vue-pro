# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [4.1.0] - 2022-03-16
### Added
  * SCSS, use the `function-no-unknow` rule from `stylelint-scss >= 4.2`.

### Changed
  * Stylelint peerDependency version to `^14.5.1` 
    (required by the function-no-unknown rule).

## [4.0.1] - 2022-03-11
### Fixed
  * Missing SCSS plugin declaration.

## [4.0.0] - 2022-03-11
### Added
  * SCSS support trough `overrides` relying on `stylelint-scss` for:
    - `at-rule-no-unknown`
    - `function-no-unknow`
    See https://github.com/pascalduez/stylelint-config-css-modules/issues/6
  * Now comes with `stylelint-scss` as `optionalDependency`.

## [3.0.0] - 2022-02-11
### Changed
  * `stylelint-config-standard@25.x` upgrade.
    Added `function-no-unknown` rule override to support `global` function.
  * **Breaking**
    Only support Stylelint 14 onwards.

## [2.3.0] - 2021-10-25
### Added
  * Add support for Stylelint 14.

## [2.2.0] - 2020-01-12
### Added
  * Add support for Stylelint 13.

## [2.1.0] - 2019-11-18
### Added
  * Add support for Stylelint 12.

## [2.0.0] - 2019-11-04
### Added
  * Add support for `:export` and `:import()` selectors.

### Changed
  * **Breaking**
   Only support Stylelint 11 onwards.

## [1.5.0] - 2019-09-16
### Added
  * Add support for Stylelint 11.

## [1.4.0] - 2019-04-14
### Added
  * Add support for Stylelint 10.

## [1.3.0] - 2018-06-23
### Added
  * Add support for modular-css `:external` pseudo class.
    See https://github.com/tivac/modular-css#style-overrides

## [1.2.0] - 2018-02-18
### Added
  * Add support for Stylelint 9.

## [1.1.0] - 2017-07-17
### Added
  * Add support for Stylelint 8.

## [1.0.0] - 2017-04-17
### Added
  * Add support for the `compose-with` property.

## [0.1.0] - 2016-09-12
  * Initial release.

[Unreleased]: https://github.com/pascalduez/stylelint-config-css-modules/compare/4.1.0...HEAD
[4.1.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/4.1.0
[4.0.1]: https://github.com/pascalduez/stylelint-config-css-modules/tags/4.0.1
[4.0.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/4.0.0
[3.0.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/3.0.0
[2.3.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/2.3.0
[2.2.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/2.2.0
[2.1.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/2.1.0
[2.0.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/2.0.0
[1.5.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.5.0
[1.4.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.4.0
[1.3.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.3.0
[1.2.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.2.0
[1.1.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.1.0
[1.0.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/1.0.0
[0.1.0]: https://github.com/pascalduez/stylelint-config-css-modules/tags/0.1.0
