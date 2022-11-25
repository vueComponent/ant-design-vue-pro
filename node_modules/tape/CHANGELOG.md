# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v5.6.0](https://github.com/ljharb/tape/compare/v5.5.3...v5.6.0) - 2022-08-16

### Commits

- [Tests] handle a broken error `cause` in node 16.9/16.10 [`53d9e18`](https://github.com/ljharb/tape/commit/53d9e18a93addb2bf70c33cc4ffe8285233a3ad0)
- [meta] use `npmignore` to autogenerate an npmignore file [`12cc602`](https://github.com/ljharb/tape/commit/12cc602f5296b023f5e226c946192e5aea453252)
- [New] `bin/tape`: include the exact arg when there are no glob results; use require.resolve on `--require` files [`e23ec12`](https://github.com/ljharb/tape/commit/e23ec12ac6bcee670ee0a507caf32512d33a9175)
- [meta] create FUNDING.yml [`f7e3161`](https://github.com/ljharb/tape/commit/f7e316175394aa72e202cf6ebfa0b3ebb0a51f60)
- [Robustness] `test` observably looks up `exec` on the object [`9dbe9ad`](https://github.com/ljharb/tape/commit/9dbe9ad9163835edb302505dec26a8e21f20d893)
- [meta] remove unused travis.yml file [`5a52443`](https://github.com/ljharb/tape/commit/5a52443dcb8c14a9b59523fbb1c05b139833c812)
- [Deps] update `glob`, `object-inspect`, `object.assign` [`f6f39a2`](https://github.com/ljharb/tape/commit/f6f39a2d8a59ab518e2647a9a122c361d2a7f4ff)
- [Dev Deps] update `@ljharb/eslint-config`, `array.prototype.flatmap`, `es-value-fixtures` [`6bc8c38`](https://github.com/ljharb/tape/commit/6bc8c381ab9117eb504ac3d46973a27619ea9b52)
- [meta] ensure `prelint` works on windows [`48896e8`](https://github.com/ljharb/tape/commit/48896e87cee94d8d704ff2fb2bf730c1c0a94c71)
- [Tests] fix no_only tests on Windows [`3e7b2ae`](https://github.com/ljharb/tape/commit/3e7b2ae9800964cf8461ab8dc10634d0c1b1218a)
- [Robustness] `test` observably looks up `exec` on the object [`330f8d5`](https://github.com/ljharb/tape/commit/330f8d586f94a8a0092b9b2061953ff9ba918325)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`3960ccf`](https://github.com/ljharb/tape/commit/3960ccf83722a25131522e35de63b89564eac519)
- [meta] add SECURITY.md [`7d31894`](https://github.com/ljharb/tape/commit/7d31894d5ad6b85567573dd875228e8e13bfac20)
- [meta] improve `prelint` script when no `.git` dir is present [`7c6dbbd`](https://github.com/ljharb/tape/commit/7c6dbbdba1769bcb80b103d43c3eaa61e395dc52)
- [Dev Deps] update `es-value-fixtures` [`6b8e118`](https://github.com/ljharb/tape/commit/6b8e118b19ff08d54509f54aab5fad3b25260e2b)
- [Fix] in node v0.4, `stream.pipe` returns `undefined` [`83d4da8`](https://github.com/ljharb/tape/commit/83d4da8ed49acd1c0478a551bc64f05a67c44e99)
- [Deps] update `string.prototype.trim` [`1a245c6`](https://github.com/ljharb/tape/commit/1a245c6b690ab7e2db346c3caf1c34eab8db456c)
- Merge tag 'v4.15.1' [`b2d547a`](https://github.com/ljharb/tape/commit/b2d547a1b06653a5cff22a8113da0f5dd392470b)
- [Deps] update `minimist` [`64677e0`](https://github.com/ljharb/tape/commit/64677e06006e1a1e4e36dc318cc4a36b2152ed95)

## [v5.5.3](https://github.com/ljharb/tape/compare/v5.5.2...v5.5.3) - 2022-04-08

### Commits

- [Robustness] `test` observably looks up `exec` on the object [`fa84c85`](https://github.com/ljharb/tape/commit/fa84c856e5f7c41d438050c5af36141899028850)
- [meta] ensure `prelint` works on windows [`bf34f60`](https://github.com/ljharb/tape/commit/bf34f600cc985c1ac21c42ce162b432751158b1e)
- [meta] improve `prelint` script when no `.git` dir is present [`5f78134`](https://github.com/ljharb/tape/commit/5f781346aa7cd7eb6a14b532304787cbc7287b9c)
- [Deps] update `minimist` [`dabc6af`](https://github.com/ljharb/tape/commit/dabc6af8cd4dd00788725b38f9829fe2a6954b27)

## [v5.5.2](https://github.com/ljharb/tape/compare/v5.5.1...v5.5.2) - 2022-02-12

### Commits

- [Dev Deps] update `@ljharb/eslint-config`; pin `eslint` [`99e7504`](https://github.com/ljharb/tape/commit/99e75043ef73031e0e352f611ed1ae9297743af4)
- [Deps] unpin `minimatch` [`c18a68b`](https://github.com/ljharb/tape/commit/c18a68bacf0f9794b9b3a89312c9d874014b7e22)

## [v5.5.1](https://github.com/ljharb/tape/compare/v5.5.0...v5.5.1) - 2022-02-10

### Commits

- [Fix] pin `minimatch` to v3.0.4, due to a breaking change in v3.0.5 [`cbe0e40`](https://github.com/ljharb/tape/commit/cbe0e408ad4ea0d2c538cd122470ab76357e64b0)

## [v5.5.0](https://github.com/ljharb/tape/compare/v5.4.1...v5.5.0) - 2022-01-26

### Merged

- [New] add `--no-only` flag/`NODE_TAPE_NO_ONLY_TEST` [`#572`](https://github.com/ljharb/tape/pull/572)

### Commits

- Merge tag 'v4.15.0' [`a5a1434`](https://github.com/ljharb/tape/commit/a5a14344f4f06518c2fe599b49a92633777986cc)
- [New] `t.match`/`t.doesNotMatch: fail the test instead of throw on wrong input types. [`a1c266b`](https://github.com/ljharb/tape/commit/a1c266bf9577420702e1067c40a4a65677add63a)
- [actions] reuse common workflows [`d3b4f46`](https://github.com/ljharb/tape/commit/d3b4f467445bb6da3a2e617c4b29e71528f32425)
- [readme] port changes from v5 [`87f9b29`](https://github.com/ljharb/tape/commit/87f9b293baeb48b507a4e9e16bba62c7ffcc4eb7)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud` [`51ae645`](https://github.com/ljharb/tape/commit/51ae645c8325d6037d4389260a442e27c2efce73)
- [Fix] `bin/tape`: delay requires until needed [`b803fd8`](https://github.com/ljharb/tape/commit/b803fd8e24b1dff96cd43092e727826873c6c571)
- [readme] hard wraps bad, soft wraps good [`82af5ed`](https://github.com/ljharb/tape/commit/82af5ed68577c15526e5dc7ecd290f2e88494170)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`, `array.prototype.flatmap` [`3287a68`](https://github.com/ljharb/tape/commit/3287a68eb1f176a6d0d85390b79c05ffc3c50615)
- [actions] update codecov uploader [`8d6aa6c`](https://github.com/ljharb/tape/commit/8d6aa6c4b084a8cec9860d868ac353862fc8b545)
- [Tests] handle carriage returns in stack traces on Windows [`f79acdf`](https://github.com/ljharb/tape/commit/f79acdfb850d94f71a01970bff96337f52bb4e5a)
- [Deps] update `glob`, `is-regex`, `string.prototype.trim` [`470ca1c`](https://github.com/ljharb/tape/commit/470ca1c0f41155d2c08537bb6cc94e04edd063bc)
- [Tests] handle a broken error `cause` in node 16.9/16.10 [`8594f3b`](https://github.com/ljharb/tape/commit/8594f3be12203e52b334a7004bf59379fb21db4f)
- [meta] better `eccheck` command [`fe6978d`](https://github.com/ljharb/tape/commit/fe6978d0a87a881a59ba7de23f2e68ff70d31074)
- [Deps] update `object-inspect`, `resolve` [`50ea080`](https://github.com/ljharb/tape/commit/50ea080561a71d8a6a2d41955441c8a094039227)
- [meta] Exclude `fs` from browser bundles (#565) [`418dc94`](https://github.com/ljharb/tape/commit/418dc94b14b440568fb58aa666df5cb2861fe22c)
- [Dev Deps] update `eslint` [`b0c8ed3`](https://github.com/ljharb/tape/commit/b0c8ed34dea1f53ac95037706746a8d3fe1ee771)
- [Tests] handle a broken error `cause` in node 16.9/16.10 [`ca1b906`](https://github.com/ljharb/tape/commit/ca1b90616c2a8fb838b1bd99c90da758c5d80a72)
- [meta] fix `prelint` so it does not fail outside of a git repo [`a09133e`](https://github.com/ljharb/tape/commit/a09133e71d3925bf830f721d05bad72550dd3517)
- [meta] fix `prelint` so it does not fail outside of a git repo [`b9959f8`](https://github.com/ljharb/tape/commit/b9959f8c132874eff32497b9189d0a7cf74e8c14)
- [Robustness] use cached `.test` [`86ec0b2`](https://github.com/ljharb/tape/commit/86ec0b262e0405ef0616201c1ffebbc5f278a217)

## [v5.4.1](https://github.com/ljharb/tape/compare/v5.4.0...v5.4.1) - 2022-01-15

### Commits

- [Fix] avoid failing in ES3 engines that lack `Object.keys`, and `.every` [`dfc5f39`](https://github.com/ljharb/tape/commit/dfc5f3927a224b03ad24a1653f1a4a1e13145014)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud` [`61446b9`](https://github.com/ljharb/tape/commit/61446b90ebff6157e84adb6c611944e26838397f)
- [Robustness] use cached `.test` [`096a9e0`](https://github.com/ljharb/tape/commit/096a9e001bdffbad37a785166ccbf9b35bcc9faa)
- [meta] better `eccheck` command [`bc4666b`](https://github.com/ljharb/tape/commit/bc4666b0deeea3b1814d2d43f1d01cf9068ac164)

## [v5.4.0](https://github.com/ljharb/tape/compare/v5.3.2...v5.4.0) - 2021-12-25

### Commits

- [New] `t.match`/`t.doesNotMatch: fail the test instead of throw on wrong input types. [`329bbb8`](https://github.com/ljharb/tape/commit/329bbb870d8862152b1bf580475a44c501dc0703)
- [actions] reuse common workflows [`728e190`](https://github.com/ljharb/tape/commit/728e190a9c9f1850a984a50c3348c2efb2f78b17)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`dc7df0f`](https://github.com/ljharb/tape/commit/dc7df0fb2393c9ee7448ffde62c4b9836a03d1e1)
- [Deps] update `has-dynamic-import`, `object-inspect` [`8881fea`](https://github.com/ljharb/tape/commit/8881fea42a60bbee5fd912def59021e76741a613)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`4023f25`](https://github.com/ljharb/tape/commit/4023f25ae22828829c5948f2c62af25fee456fea)

## [v5.3.2](https://github.com/ljharb/tape/compare/v5.3.1...v5.3.2) - 2021-11-15

### Fixed

- [Tests] handle v8 6.9 changing an error message [`#562`](https://github.com/ljharb/tape/issues/562)

### Commits

- [readme] hard wraps bad, soft wraps good [`b445a2b`](https://github.com/ljharb/tape/commit/b445a2bc9a0d5bd3db8f1c5fdde21163e3129701)
- [readme] add badges [`4c8d00a`](https://github.com/ljharb/tape/commit/4c8d00a81323a45c290f8d0e2a8389856ded5be6)
- [actions] update codecov uploader [`f040c4f`](https://github.com/ljharb/tape/commit/f040c4fcb0fac257d27a6cb2733f8f39a5d3d051)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest` [`459a1c5`](https://github.com/ljharb/tape/commit/459a1c5093db6a2cbf57e815d5b85d4e23511958)
- [Tests] node 17+ smooshes a version number on the end of the stack trace [`e41763f`](https://github.com/ljharb/tape/commit/e41763f8315d92d0d5bcd13f397f7d2f78f69745)
- [Tests] handle carriage returns in stack traces on Windows [`26e8113`](https://github.com/ljharb/tape/commit/26e81135e03a808aa917bdad3d32f1ee71b2ea44)
- [Fix] use `file://` URLs for dynamic `import()` [`d487add`](https://github.com/ljharb/tape/commit/d487addb1ae69064267efc58536186229c73ea41)
- [Dev Deps] ping `signal-exit` to v3.0.3 due to https://github.com/tapjs/signal-exit/issues/66 [`3c30a55`](https://github.com/ljharb/tape/commit/3c30a555a59e5d64875116136d14fe217e59be73)
- [meta] Exclude `fs` from browser bundles [`00f21ea`](https://github.com/ljharb/tape/commit/00f21eaa14eb3d3dc70fbf518252a6f18aa7b22c)
- [Dev Deps] update `@ljharb/eslint-config` [`c837b02`](https://github.com/ljharb/tape/commit/c837b02016e240b93ae7ef40c21f4df82e7a80f9)
- [Deps] update `string.prototype.trim` [`c1248d7`](https://github.com/ljharb/tape/commit/c1248d7e434e6a4b3c61fa7b62e1f5badfa3d162)
- [Dev Deps] update `array.prototype.flatmap` [`97384b1`](https://github.com/ljharb/tape/commit/97384b10477e3112e0aefee7957204e1c7a9db57)
- [readme] fix markdown; github still has a rendering bug [`a33b5f9`](https://github.com/ljharb/tape/commit/a33b5f9b5b0a00a031d06155224f4bca6d9769af)
- [Deps] update `glob` [`477bb4c`](https://github.com/ljharb/tape/commit/477bb4c62c071889fde563e2bd133da02aa91b0b)
- Revert "[Dev Deps] ping `signal-exit` to v3.0.3 due to https://github.com/tapjs/signal-exit/issues/66" [`60bbd83`](https://github.com/ljharb/tape/commit/60bbd83ff1a342059a4ec894132ba20583a486f2)

## [v5.3.1](https://github.com/ljharb/tape/compare/v5.3.0...v5.3.1) - 2021-08-06

### Merged

- [New] add `.teardown()` on `t` instances [`#546`](https://github.com/ljharb/tape/pull/546)
- [readme] add `tape-describe` to 'other' section [`#523`](https://github.com/ljharb/tape/pull/523)

### Fixed

- [New] add `.teardown()` on `t` instances (#546) [`#531`](https://github.com/ljharb/tape/issues/531)
- [readme] add `tape-describe` to 'other' section (#523) [`#522`](https://github.com/ljharb/tape/issues/522)

### Commits

- [Tests] make `stripFullStack` output an array of lines, for better failure messages [`f299759`](https://github.com/ljharb/tape/commit/f2997591a038fa48239f205e40eed5c75278a261)
- [eslint] fully enable `@ljharb` eslint config [`836610d`](https://github.com/ljharb/tape/commit/836610d9772b91a8d31f311834ae1325f2f740bf)
- [actions] use `node/install` instead of `node/run`; use `codecov` action [`46aff81`](https://github.com/ljharb/tape/commit/46aff81f10ad63990f6047c0bdba3be0c90bd3dd)
- [readme] improve `t.throws` documentation [`b36f816`](https://github.com/ljharb/tape/commit/b36f81698fbf4d172a49abb75b9474c4a978df5c)
- [Fix] `bin/tape`: delay requires until needed [`c8f3ce3`](https://github.com/ljharb/tape/commit/c8f3ce32c73e092940e29dc72f0abba3b6529936)
- [Refactor] avoid reassigning arguments [`5c4052f`](https://github.com/ljharb/tape/commit/5c4052fcf51479320c9482c425a66dcbcc4a509a)
- [Tests] add test case for #519 for test.comment() in createStream/objectMode context [`1700642`](https://github.com/ljharb/tape/commit/17006422fa8189a7e361edfb1e803b73a72b4894)
- [Refactor] use `call-bind/callBound` instead of `function-bind` directly [`967b73f`](https://github.com/ljharb/tape/commit/967b73fe882e9c95c0436e6ce93f24fa3a2e14a9)
- [readme] Another way to create custom reporters [`d81f9f6`](https://github.com/ljharb/tape/commit/d81f9f6681ae72d3425b91e2f7a294e6d4225675)
- [meta] do not publish github action workflow files [`6bb3496`](https://github.com/ljharb/tape/commit/6bb34964abb1e704fe3dcc9fcf8d27d16ff5e296)
- [Refactor] remove unused line, unneeded var initialization; add missing `new` [`da0cdf1`](https://github.com/ljharb/tape/commit/da0cdf1651fec20f66a6bed2d1b17944e18dcd48)
- [Refactor] remove use of legacy `exports` [`a04439c`](https://github.com/ljharb/tape/commit/a04439c3027f3dc0dac8cf8ef5d24a493366be6a)
- [Deps] update `glob`, `is-regex`, `object-inspect`, `resolve`, `string.prototype.trim` [`6e71e6e`](https://github.com/ljharb/tape/commit/6e71e6ea1e009a62546a401a35974ca867a24b9a)
- [eslint] remove useless regex escapes [`1515ff4`](https://github.com/ljharb/tape/commit/1515ff4a8f749aa6d075bffdcda543ca94c559a9)
- [readme] remove travis badge; add actions and codecov badges [`57a7cc9`](https://github.com/ljharb/tape/commit/57a7cc906ec4f24f503350580c5859e5b3e56805)
- [meta] run `aud` in `posttest` [`3907aa5`](https://github.com/ljharb/tape/commit/3907aa560caa2c8d30a6a9168c0d7a3d65a3ba3e)
- [Refactor] generalize error message from calling `.end` more than once [`da8ca46`](https://github.com/ljharb/tape/commit/da8ca46cc0be28a3d4690a4009e0ddec7fc6f779)
- [Tests] handle stack differences in node 15 [`b7b01ec`](https://github.com/ljharb/tape/commit/b7b01ec38ede9f9722b5cce90574782e1eda1305)
- [Deps] update `is-regex`, `object-inspect`, `string.prototype.trim` [`e344080`](https://github.com/ljharb/tape/commit/e344080b1a4b097e1baa1a2b2e843fc283f3f5c2)
- [New] Include name of test in log when test times out (#524) [`78b4d98`](https://github.com/ljharb/tape/commit/78b4d9833a2df7593f653b263588b9a49ca3fe08)
- [Dev Deps] update `eslint` [`6d5e4ad`](https://github.com/ljharb/tape/commit/6d5e4ad3cb1f25ea03b59db4e894d51fa5b86c11)
- [Refactor] Avoid setting message property on primitives; use strict mode to catch this [`9dfb680`](https://github.com/ljharb/tape/commit/9dfb680e7543a3a701b3e410bfccbcce3b274d9f)
- [Deps] update `is-regex` [`a7ca7a3`](https://github.com/ljharb/tape/commit/a7ca7a308269bc3a250170441553d0321e0d8044)
- Merge tag 'v4.14.0' [`1f1a4a7`](https://github.com/ljharb/tape/commit/1f1a4a7c7c9ea3632074e4a008d430bbd275b231)
- [meta] add `safe-publish-latest`; use `prepublishOnly` script for npm 7+ [`c3d434d`](https://github.com/ljharb/tape/commit/c3d434d8b86a0be162efb7fb548f0405239a2688)
- [meta] ensure `not-in-publish`‘s absence does not fail anything [`2a0619d`](https://github.com/ljharb/tape/commit/2a0619d3193287aaa948fc4edf0bb2ccb4150a7b)
- [readme] remove long-dead testling-ci badge [`1461611`](https://github.com/ljharb/tape/commit/1461611bce87b190179d1ac0e2c69438f2b12f31)
- [Tests] ensure bin/tape is linted [`faa51b5`](https://github.com/ljharb/tape/commit/faa51b5baa709ba2e72f78be7cb7ce243c02a771)
- [Dev Deps] update `eslint` [`fad6165`](https://github.com/ljharb/tape/commit/fad6165ae85ebff132daedd1a1bdf3ee307c4ea1)
- [Dev Deps] update `eslint` [`79a0f4b`](https://github.com/ljharb/tape/commit/79a0f4b7b1d0c6db9228cdedf918f20a34dd7762)
- [meta] add missing `safe-publish-latest` dep [`d0a3888`](https://github.com/ljharb/tape/commit/d0a3888ee1b1481ef9ca13695414022164fbc3c2)
- [Tests] exclude examples from coverage [`283f537`](https://github.com/ljharb/tape/commit/283f537f56885d18afbc2328c0c52ee60d528332)

## [v5.3.0](https://github.com/ljharb/tape/compare/v5.2.2...v5.3.0) - 2021-07-26

### Commits

- [eslint] fully enable `@ljharb` eslint config [`9d3c5b4`](https://github.com/ljharb/tape/commit/9d3c5b4e84dbeb1272b450e74ce022cb70c56e2a)
- [New] Use import() on esm files in supported node versions [`28d6e51`](https://github.com/ljharb/tape/commit/28d6e51b9beb7252d7ad130424fdb0062425f7a0)
- [eslint] fully enable `@ljharb` eslint config [`ae8b5c0`](https://github.com/ljharb/tape/commit/ae8b5c0639be6c3b2fd0b2e132ca50ee9f760e94)
- [eslint] enable `no-shadow` [`f0756f3`](https://github.com/ljharb/tape/commit/f0756f3b12329a122498f99f6448ec8c9eafec50)
- [eslint] enable `curly`, `object-curly-spacing`, `object-curly-newline` [`e9b75e1`](https://github.com/ljharb/tape/commit/e9b75e14068359843082fd70994b19f871432a65)
- [Tests] uncaught exceptions and unhandled rejections importing files with bin/tape [`e6d2faf`](https://github.com/ljharb/tape/commit/e6d2faf67888dbb8e1262d7d083f0be7c59672cc)
- [eslint] enable `function-paren-newline`, `function-call-argument-newline` [`ae6de0c`](https://github.com/ljharb/tape/commit/ae6de0c74a288f6d8bc83f45a7a686faf09ba9b1)
- [actions] use `node/install` instead of `node/run`; use `codecov` action [`5a6de66`](https://github.com/ljharb/tape/commit/5a6de6625ab04d487d729617be83a7baf769f4f9)
- [eslint] enable `wrap-regex` [`7dcbd76`](https://github.com/ljharb/tape/commit/7dcbd7631a9ff5675f1ff0be477f0a1714b81dd3)
- [Refactor] add names to `Test.prototype` functions [`077a108`](https://github.com/ljharb/tape/commit/077a108686590363f23ba2ecf2c782016a1683e9)
- [eslint] enable `comma-spacing` [`4acf1f2`](https://github.com/ljharb/tape/commit/4acf1f292289c40c1abfb2552e09e28a9da3416a)
- [eslint] update `no-redeclare` [`b03d4c8`](https://github.com/ljharb/tape/commit/b03d4c8e722841d580a581a5d492277a7c701f94)
- [eslint] enable `brace-style` [`06eba07`](https://github.com/ljharb/tape/commit/06eba07d6b73ba2650f581372fd613f89385993c)
- [eslint] enable `no-unused-vars` [`2ebd23a`](https://github.com/ljharb/tape/commit/2ebd23a03c71d14890dc064b29526e3d523daf93)
- [eslint] enable `consistent-return` [`fb4e3cf`](https://github.com/ljharb/tape/commit/fb4e3cfc4df1f932496fbca35c013f6ad65df53b)
- [Refactor] avoid reassigning arguments [`8a0ab53`](https://github.com/ljharb/tape/commit/8a0ab5348183f1b7deabb2a87d4fb3c4dc272390)
- [eslint] enable `semi-style` [`5f8afc9`](https://github.com/ljharb/tape/commit/5f8afc997c793ca16de53aa56ac4d40b8afc8d4a)
- [readme] Another way to create custom reporters [`a68277c`](https://github.com/ljharb/tape/commit/a68277c968ff7cf6b995c2cc20ca1545642c7b4d)
- [eslint] enable `no-extra-parens` [`a08dc34`](https://github.com/ljharb/tape/commit/a08dc34371a8dc406581fb85edb591150f9c0f35)
- [eslint] enable `no-multi-spaces`, `no-multiple-empty-lines`, `space-in-parens` [`be1eb21`](https://github.com/ljharb/tape/commit/be1eb212aeeec2c229208a4702ff99af0cabb5f7)
- [Refactor] `bin/tape`: separate "preparing of files list" from "require files list" [`021fa6d`](https://github.com/ljharb/tape/commit/021fa6d22bc85f2e8f075405bcb97c6a1b87af22)
- [Refactor] remove unused line, unneeded var initialization; add missing `new` [`da45ae6`](https://github.com/ljharb/tape/commit/da45ae6b158fbbdda2cc5c2edce6e0353b65f687)
- [eslint] enable `no-lonely-if` [`771f3dd`](https://github.com/ljharb/tape/commit/771f3ddd1a3ad3a629c1d1a0780052d51143435b)
- [eslint] enable `space-infix-ops` [`233ffc6`](https://github.com/ljharb/tape/commit/233ffc623ec212b202037e03b503a6667d4deb3f)
- [Refactor] remove use of legacy `exports` [`c332d62`](https://github.com/ljharb/tape/commit/c332d629b8c5366aa81a0ea413c49c7b838128cb)
- [eslint] enable `wrap-iife` [`428636c`](https://github.com/ljharb/tape/commit/428636c047f946738ca77796599aeb32cd607072)
- [Docs] correct docs for `t.teardown` [`c4a4992`](https://github.com/ljharb/tape/commit/c4a4992cdd59d2c5ca3282bfbf2ba4c0b863eafc)
- [readme] remove travis badge; add actions and codecov badges [`900f823`](https://github.com/ljharb/tape/commit/900f823f4a0fcbf5875df387d60bfde85236faa1)
- [eslint] enable `no-extra-semi` [`1af8f52`](https://github.com/ljharb/tape/commit/1af8f529df22eb00a62474dfd6dfe5628f8f7317)
- [Deps] update `glob`, `is-regex`, `object-inspect` [`e211546`](https://github.com/ljharb/tape/commit/e2115460307cc5424392157f4e86515c54e2e819)
- [eslint] enable `no-regex-spaces` [`ef0069a`](https://github.com/ljharb/tape/commit/ef0069a9de38c89cb4b4117ffa165e7f0c6a6351)
- [Dev Deps] update `aud`, `eslint` [`00a98d3`](https://github.com/ljharb/tape/commit/00a98d3b73aad7af987cddb79b0f1e5c7d27efc2)
- [Deps] update `object-inspect` [`9bbf270`](https://github.com/ljharb/tape/commit/9bbf27083d6a63d0f61b984cf173a004583cdc35)
- [Dev Deps] update `eslint` [`57b659f`](https://github.com/ljharb/tape/commit/57b659f8324fbc63913bb41c108e1e165d5bcf07)
- [Dev Deps] update `eslint` [`e628b23`](https://github.com/ljharb/tape/commit/e628b23a35c35948d7166ac58964043d847e04eb)
- [meta] ensure `not-in-publish`‘s absence does not fail anything [`fb3a243`](https://github.com/ljharb/tape/commit/fb3a243bfe1baa4c8afb44b8c654cd98500c2e9f)
- [Deps] update `object-inspect` [`771c8c4`](https://github.com/ljharb/tape/commit/771c8c43fda1907f61b6e9fd462a4e6c747f3527)
- [meta] add `safe-publish-latest`; use `prepublishOnly` script for npm 7+ [`379115d`](https://github.com/ljharb/tape/commit/379115dc77717ff7611d156c36da5452a5b217e2)
- [Tests] exclude examples from coverage [`75decb3`](https://github.com/ljharb/tape/commit/75decb37ef2661f960adf9ff44dc76e2885d10d2)

## [v5.2.2](https://github.com/ljharb/tape/compare/v5.2.1...v5.2.2) - 2021-03-03

### Commits

- [Fix] proper exit behavior in node v0.6 [`3f94e68`](https://github.com/ljharb/tape/commit/3f94e687b976bdb324c2148d73087e769003f878)

## [v5.2.1](https://github.com/ljharb/tape/compare/v5.2.0...v5.2.1) - 2021-02-27

### Fixed

- [Fix] `t.teardown()`: ensure callback is only called once [`#551`](https://github.com/ljharb/tape/issues/551)

### Commits

- [Deps] update `object-is`, `string.prototype.trim` [`b497ead`](https://github.com/ljharb/tape/commit/b497ead367786cf21ddc818ee6e8f24c330b9ea0)

## [v5.2.0](https://github.com/ljharb/tape/compare/v5.1.1...v5.2.0) - 2021-02-20

### Fixed

- [New] add `.teardown()` on `t` instances [`#531`](https://github.com/ljharb/tape/issues/531)
- [readme] improve `t.throws`/`t.doesNotThrow` documentation [`#540`](https://github.com/ljharb/tape/issues/540)

### Commits

- [readme] improve `t.throws` documentation [`94220ba`](https://github.com/ljharb/tape/commit/94220babb105950dfc2d09d67b4731bf026449b5)
- [Tests] exclude node v0.6, for now [`3c05a87`](https://github.com/ljharb/tape/commit/3c05a873212c9dd5e773da070488f75b09a4e5f4)
- [Deps] update `is-regex`, `resolve` [`8c52d12`](https://github.com/ljharb/tape/commit/8c52d121eadee69e6b0d800e798ae7bf1f86eff9)
- [Dev Deps] update `eslint`, `aud` [`f847c85`](https://github.com/ljharb/tape/commit/f847c85167a173fcdd2365b5d6f234208a5d27a4)
- [Deps] update `call-bind` [`ce0b1ad`](https://github.com/ljharb/tape/commit/ce0b1ad6ef395bd1dba7403ea679af5284f61c0e)
- [Dev Deps] update `eslint` [`83f1eec`](https://github.com/ljharb/tape/commit/83f1eec7d51fd812fd4ceb34b20857617e42f272)

## [v5.1.1](https://github.com/ljharb/tape/compare/v5.1.0...v5.1.1) - 2021-01-04

### Commits

- [Tests] make `stripFullStack` output an array of lines, for better failure messages [`0743333`](https://github.com/ljharb/tape/commit/07433333e14fd283ceed246795863d59576d3286)
- [Tests] migrate tests to Github Actions [`266bc66`](https://github.com/ljharb/tape/commit/266bc66b0fbbda399aff42afb957ce117d9ee4b2)
- [Fix] preserve stack traces for returned Promises (async/await) [`d505cdf`](https://github.com/ljharb/tape/commit/d505cdf375bb27c0eea4b60d9da290bb11339c6a)
- [readme] Document unexpected `t.end()` behavior [`b505c4c`](https://github.com/ljharb/tape/commit/b505c4c45ff968a5cfa91bd34f80a95493936671)
- [Tests] add `timeoutAfter` test with Promises [`e8255cf`](https://github.com/ljharb/tape/commit/e8255cf46ee77626e9eef1c2909899c9508173da)
- [readme] improve method docs [`df5a124`](https://github.com/ljharb/tape/commit/df5a124e106540d77ee737127502db26db541ded)
- [Robustness] cache and call-bind more prototype methods [`8e60dcb`](https://github.com/ljharb/tape/commit/8e60dcbbb0724fb5fbaacbfb521356e6d268d42c)
- [Tests] add `npm run test:example` to test non-failing examples. [`4210e44`](https://github.com/ljharb/tape/commit/4210e442a3739969ff32075a72a49c6d95730adf)
- [eslint] fix some inconsistencies [`7ca56eb`](https://github.com/ljharb/tape/commit/7ca56ebe2c78d0286e21a589c35ae28275aa8bf7)
- [eslint] ensure no trailing commas [`04da90b`](https://github.com/ljharb/tape/commit/04da90bb387656e585bec26a325e3400cb6bd1ba)
- [meta] add Automatic Rebase and Require Allow Edits workflows [`6d72960`](https://github.com/ljharb/tape/commit/6d729605929dfa3a41607f46e0e7da8024c33976)
- [Tests] run `nyc` on all tests [`5ec21aa`](https://github.com/ljharb/tape/commit/5ec21aa2e05ca18d88924edc1be9b175fe706af1)
- [Refactor] use `call-bind/callBound` instead of `function-bind` directly [`b19da31`](https://github.com/ljharb/tape/commit/b19da31dc4d40ffccbd8bd38d3bd410fce604172)
- [meta] do not publish github action workflow files [`82c3904`](https://github.com/ljharb/tape/commit/82c3904483419fb9f36ac9a73a754d100c24e107)
- [Tests] skip Promise tests when Promises are not available [`688256a`](https://github.com/ljharb/tape/commit/688256a75340a6d088736610a77c4d9d3c580905)
- [meta] run `aud` in `posttest` [`b9bec0e`](https://github.com/ljharb/tape/commit/b9bec0e92ef2834693fc7c7e3dc779dd1baea907)
- [readme] Added tabe into reporter list [`7aff9e4`](https://github.com/ljharb/tape/commit/7aff9e4de9e70cae53b1287b03bd23d3fc22420c)

## [v5.1.0](https://github.com/ljharb/tape/compare/v5.0.1...v5.1.0) - 2020-12-29

### Fixed

- [readme] add `tape-describe` to 'other' section [`#522`](https://github.com/ljharb/tape/issues/522)

### Commits

- [Tests] add test case for #519 for test.comment() in createStream/objectMode context [`40ec79a`](https://github.com/ljharb/tape/commit/40ec79a125df5282bc3983771306932cf97a21b8)
- [Deps] update `deep-equal`, `object-inspect`, `object-is`, `object.assign`, `resolve`, `string.prototype.trim` [`434f615`](https://github.com/ljharb/tape/commit/434f6156cb137bd28377c98664af8e3634c1030c)
- [Deps] update `deep-equal`, `is-regex`, `object-inspect`, `object-is`, `object.assign`, `string.prototype.trim` [`df23eda`](https://github.com/ljharb/tape/commit/df23edad43112ed5d3f3aa318289a57b3540002b)
- [eslint] remove useless regex escapes [`3554d4b`](https://github.com/ljharb/tape/commit/3554d4b049f34065c6a643c5cda3d88c70a4908e)
- [readme] document Promise support; remove Promise-related alternatives [`4665d63`](https://github.com/ljharb/tape/commit/4665d6331127b23c10c0798947d9751d635dba40)
- [Tests] handle stack differences in node 15 [`1ac9ecf`](https://github.com/ljharb/tape/commit/1ac9ecf927bb1958857cb4050ec725cd3f22d27a)
- [New] Include name of test in log when test times out [`e142c29`](https://github.com/ljharb/tape/commit/e142c298e8c76c49954ede50ab59e3f2e5662d77)
- [Dev Deps] update `eslint`, `js-yaml` [`7574152`](https://github.com/ljharb/tape/commit/75741524e4715d6cf0a969bc7e987fb881a9494a)
- [Dev Deps] update `eslint` [`c6772d1`](https://github.com/ljharb/tape/commit/c6772d1fd3ca827760ca01114aec25e21751d701)
- [Dev Deps] update `eslint` [`5b7720a`](https://github.com/ljharb/tape/commit/5b7720a82f505d4c8db3d340256369564d828dc6)
- [Deps] update `resolve` [`898302b`](https://github.com/ljharb/tape/commit/898302b3e914c93b407088d36a224355b898bb0c)

## [v5.0.1](https://github.com/ljharb/tape/compare/v5.0.0...v5.0.1) - 2020-05-24

### Merged

- [Fix] `createStream`: `result` payload is not always an object [`#519`](https://github.com/ljharb/tape/pull/519)
- [Fix] Update RegExp for matching stack frames to handle Promise/then scenario [`#516`](https://github.com/ljharb/tape/pull/516)
- [Tests] Fix simple typo, placehodler -&gt; placeholder [`#500`](https://github.com/ljharb/tape/pull/500)

### Fixed

- [Fix] `createStream`: `result` payload is not always an object [`#519`](https://github.com/ljharb/tape/issues/519)
- [Fix] `createStream`: `result` payload is not always an object (#519) [`#519`](https://github.com/ljharb/tape/issues/519)
- [Fix] Update RegExp for matching stack frames to handle Promise/then scenario (#516) [`#515`](https://github.com/ljharb/tape/issues/515)
- [Fix] Update RegExp for matching stack frames to handle Promise/then scenario [`#515`](https://github.com/ljharb/tape/issues/515)

### Commits

- Merge tag 'v4.13.3' [`b7af113`](https://github.com/ljharb/tape/commit/b7af113832ae5f3a2b379d859abf8f1513036961)
- [Dev Deps] update `eslint`, `falafel`, `js-yaml` [`9676a21`](https://github.com/ljharb/tape/commit/9676a21784a90a13e29505d86901cd1cd0c1c7db)
- [Deps] update `minimist`, `resolve` [`8887189`](https://github.com/ljharb/tape/commit/8887189c60d956f13f7b54497443bb4be2726748)
- [Dev Deps] update `eslint` [`c421eb3`](https://github.com/ljharb/tape/commit/c421eb36b4f6c3c51db329e2e2f03139ffa803af)
- [readme] add `tape-repeater` (#511) [`33712e2`](https://github.com/ljharb/tape/commit/33712e2dd7a89c6c97f58bfe38882631616363c4)
- [readme] add `tape-repeater` [`0b5804d`](https://github.com/ljharb/tape/commit/0b5804d43068602e1615dfd395a3d85949bb03da)
- [examples] add `ecstatic` [`9b87675`](https://github.com/ljharb/tape/commit/9b876753153e0a8f94894fbbe9e08d78df12b039)
- [readme] Add link to tape-player (in-process reporter) (#496) [`bc1334b`](https://github.com/ljharb/tape/commit/bc1334bc008e5d5aecd61c580aad1657932da146)
- [Docs] add an optional emoji version for tap-spec consumer (#501) [`6326dc6`](https://github.com/ljharb/tape/commit/6326dc62e761b92b87377b30c539f762ed2e9052)

## [v5.0.0](https://github.com/ljharb/tape/compare/v5.0.0-next.5...v5.0.0) - 2020-04-24

### Commits

- [Deps] update `deep-equal`, `minimist`, `object-is`, `resolve` [`6fd0691`](https://github.com/ljharb/tape/commit/6fd0691cbd5f07474f6a8e77c28468bcc8eb1d3c)
- [Breaking] remove full "lib" export; replace with explicit exports [`3bb97f1`](https://github.com/ljharb/tape/commit/3bb97f103d93603396c40472aff31f17b40d18d3)
- [Dev Deps] update `falafel` [`f24491d`](https://github.com/ljharb/tape/commit/f24491dce15696f5ca607c3d8a8a978784c8588a)
- [Tests] Fix simple typo, placehodler -&gt; placeholder [`8ba3668`](https://github.com/ljharb/tape/commit/8ba3668c8c9acd03ddb64e5883cf996f26c8f689)
- [examples] add `ecstatic` [`d021e9d`](https://github.com/ljharb/tape/commit/d021e9d3cf037ffd65c332339cdd9d5e831dcb69)
- [readme] Add link to tape-player (in-process reporter) [`5b9c442`](https://github.com/ljharb/tape/commit/5b9c4425494d6ce9c98d9bdb8f50757caf8a2be9)
- [Docs] add an optional emoji version for tap-spec consumer [`f5d0899`](https://github.com/ljharb/tape/commit/f5d0899665c53d81a8e8dfcecce77c202f241098)

## [v5.0.0-next.5](https://github.com/ljharb/tape/compare/v5.0.0-next.4...v5.0.0-next.5) - 2020-03-02

### Merged

- [patch] Print name of test that didnt end [`#498`](https://github.com/ljharb/tape/pull/498)

### Fixed

- [Breaking] only `looseEqual`/`deepEqual, and their inverses, are now non-strict. [`#495`](https://github.com/ljharb/tape/issues/495)
- [Breaking] `equal`: use `==`, not `===`, to match `assert.equal` [`#495`](https://github.com/ljharb/tape/issues/495)
- [Breaking] `strictEqual`: bring `-0`/`0`, and `NaN` into line with `assert` [`#495`](https://github.com/ljharb/tape/issues/495)

### Commits

- [Tests] add tests for edge cases and numerics [`4526b39`](https://github.com/ljharb/tape/commit/4526b39834db8061feeeb931dcf06047f29e9970)
- [Breaking] make equality functions consistent: [`24240e2`](https://github.com/ljharb/tape/commit/24240e2b7e0f32e5db7bc46c631dd2f915e341f1)
- [Tests] sync new test cases from master [`98b2695`](https://github.com/ljharb/tape/commit/98b2695ceebf6e1e175d29f291c9c1073416d947)
- [eslint] enable `quotes` rule [`d686aa2`](https://github.com/ljharb/tape/commit/d686aa2542a3641255a5427408cf4173450b9d6e)
- [eslint] enable `quotes` rule [`1ab6bdb`](https://github.com/ljharb/tape/commit/1ab6bdbfc4fadec57ecbf99f73ba73b03e6b8046)
- [Refactor] remove unused code [`e6b6f11`](https://github.com/ljharb/tape/commit/e6b6f119720e7e7b3aa43d72cdfa384f47e76cc2)
- [Deps] update `resolve` [`398503c`](https://github.com/ljharb/tape/commit/398503cfcabbaa56aa1e79d7523815a240d2d775)
- [Deps] update `resolve` [`15ea7d1`](https://github.com/ljharb/tape/commit/15ea7d1765b32a35a6ccde4ad3ab1898a356600e)

## [v5.0.0-next.4](https://github.com/ljharb/tape/compare/v5.0.0-next.3...v5.0.0-next.4) - 2020-01-18

### Fixed

- [Fix] `match`/`doesNotMatch`: when passing, ensure the proper default assert message shows up [`#494`](https://github.com/ljharb/tape/issues/494)
- [Fix] `match`/`doesNotMatch`: when passing, ensure the proper default assert message shows up [`#494`](https://github.com/ljharb/tape/issues/494)

### Commits

- [Refactor] remove unused code [`cf8dccc`](https://github.com/ljharb/tape/commit/cf8dccc49511ab2c2dd6f78cf0c837de4d4fafea)
- [Deps] update `resolve` [`b30b6f1`](https://github.com/ljharb/tape/commit/b30b6f1334aab29ef0f80635de2ce2e63ce172d8)
- [Fix] `.catch` is a syntax error in older browsers [`6df4dfc`](https://github.com/ljharb/tape/commit/6df4dfc55add6a05d4b5e9cd4cdefafdda51fab4)
- Merge tag 'v4.13.1' [`925bf01`](https://github.com/ljharb/tape/commit/925bf017cdb1ba2704a14959ad03d25d2f179997)

## [v5.0.0-next.3](https://github.com/ljharb/tape/compare/v5.0.0-next.2...v5.0.0-next.3) - 2020-01-08

### Commits

- [Fix] tests without a callback that are *skipped* should not fail [`82e316b`](https://github.com/ljharb/tape/commit/82e316b5326925ec3fb898d8849294645b4a4d60)

## [v5.0.0-next.2](https://github.com/ljharb/tape/compare/v5.0.0-next.1...v5.0.0-next.2) - 2020-01-07

### Commits

- Merge tag 'v4.13.0' [`bf07cf8`](https://github.com/ljharb/tape/commit/bf07cf8fd739d48433be1cae9be75d1ac45bc4d2)
- [New] add `t.match()` and `t.doesNotMatch()`, new in `node` `v13.6` [`0330d82`](https://github.com/ljharb/tape/commit/0330d8254d361b5b47d1ca427447a2ba84f6c2b6)
- [New] add `t.match()` and `t.doesNotMatch()`, new in `node` `v13.6` [`36a30eb`](https://github.com/ljharb/tape/commit/36a30ebf119ab33f07b4c539d7fc140ba812082a)
- [New] `tape` binary: Add -i flag to ignore files from gitignore (#492) [`e0e2542`](https://github.com/ljharb/tape/commit/e0e2542240875e5dad2ba12b1edc4be3251ae571)
- [New] `tape` binary: Add -i flag to ignore files from gitignore [`a0f9350`](https://github.com/ljharb/tape/commit/a0f93506093b8ff3902db667878a6b5078ab863e)
- [lint] fix object key spacing [`d7c2fd3`](https://github.com/ljharb/tape/commit/d7c2fd37312cb81109dff7904646692cfb373cb6)
- [Tests] handle stack trace variation in node &lt;= 0.8 [`21ac403`](https://github.com/ljharb/tape/commit/21ac4036eb99af0eb41d88f038af0d4d9623112c)
- [Deps] update `resolve` [`0f15085`](https://github.com/ljharb/tape/commit/0f15085b090ef52176564cbc2a6b7994d38173f5)
- [readme] remove long-dead testling-ci badge [`08fae38`](https://github.com/ljharb/tape/commit/08fae38fb88c7d1d6410e230b908ad3375421cb3)

## [v5.0.0-next.1](https://github.com/ljharb/tape/compare/v5.0.0-next.0...v5.0.0-next.1) - 2020-01-01

### Fixed

- [Breaking] fail any assertion after `.end()` is called [`#264`](https://github.com/ljharb/tape/issues/264)
- [Breaking] equality functions: throw when &lt; 2 arguments are provided [`#442`](https://github.com/ljharb/tape/issues/442)
- [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` [`#137`](https://github.com/ljharb/tape/issues/137)

### Commits

- [Breaking] `throws`: bring into line with node’s `assert.throws` [`547dc14`](https://github.com/ljharb/tape/commit/547dc14cac4afad8d2e9dd91c5ffc617bc441eed)
- [Refactor] make everything strict mode [`11b7d85`](https://github.com/ljharb/tape/commit/11b7d850ffaa8cb679419ff4a0e314b06a3225b9)
- [lint] fix object key spacing [`85a8a7f`](https://github.com/ljharb/tape/commit/85a8a7f8c91d6395cffabb2828b867252e724af0)
- [Tests] Fail a test if its callback returns a promise that rejects [`ad75f86`](https://github.com/ljharb/tape/commit/ad75f86a325e385fc29bc81ec162580a51b9cf49)
- [Fix] error stack file path can contain parens/spaces [`9094271`](https://github.com/ljharb/tape/commit/9094271d8d3813fd18618879be3582a842c0d279)
- [Breaking] tests with no callback are failed TODO tests [`03529a9`](https://github.com/ljharb/tape/commit/03529a991c4624cc4299f6ffd62da9d1fda77a71)
- [eslint] fix remaining undeclared variables [`1a59e0b`](https://github.com/ljharb/tape/commit/1a59e0b449f448bdd8a4267e8fe435b484ae1c06)
- [Tests] improve some failure output by adding messages [`bd76254`](https://github.com/ljharb/tape/commit/bd762540a59426f6fdbdc6f5e25bd45adc27c1ee)
- [Tests] handle stack trace variation in node &lt;= 0.8 [`bffb60c`](https://github.com/ljharb/tape/commit/bffb60c4fab03d5f1f7292d788142018d1e25f6d)
- [Breaking] add "exports" to restrict public API [`0e713a2`](https://github.com/ljharb/tape/commit/0e713a2d5fca1a2d010744477cde4911fc067f44)
- [Refactor] generalize error message from calling `.end` more than once [`8e8af01`](https://github.com/ljharb/tape/commit/8e8af01d1fdb76d89334e7e585f7a140c0b1593e)
- [Tests] ensure bin/tape is linted [`b5b40ae`](https://github.com/ljharb/tape/commit/b5b40aeac993a25243e80aa33ff18f6961ca1da1)
- [eslint] Fix leaking variable in tests [`07e13a8`](https://github.com/ljharb/tape/commit/07e13a8f05f26a75fc6a377711fe85b082e672fb)
- [Refactor] Avoid setting message property on primitives; use strict mode to catch this [`0715294`](https://github.com/ljharb/tape/commit/071529417254377da425a457b3fc1b1faa1d622d)
- Merge tag 'v4.12.1' [`a11e272`](https://github.com/ljharb/tape/commit/a11e27291b4457f816c9393abb9e9cdd2bf3ad64)
- [Deps] update `resolve` [`b765bba`](https://github.com/ljharb/tape/commit/b765bba1ea56075d5382b203b6902c8fc5f2d5a6)
- [Dev Deps] update `eslint` [`949781f`](https://github.com/ljharb/tape/commit/949781faf753d5481085f993210738e7b93b3172)

## [v5.0.0-next.0](https://github.com/ljharb/tape/compare/v4.16.1...v5.0.0-next.0) - 2019-12-20

### Commits

- [Breaking] if a test callback returns a rejected thenable, fail the test. [`f248610`](https://github.com/ljharb/tape/commit/f248610eedc9e7236e7e6a2c4a5c0d4415dcde95)
- [Breaking] `error` should not emit `expected`/`actual` diags [`f6dc34e`](https://github.com/ljharb/tape/commit/f6dc34e4531fd279cb985166bceec160929658f1)
- [Deps] update `resolve` [`dff5f1f`](https://github.com/ljharb/tape/commit/dff5f1f4b12be558bcf4b6547eaebba162afde6d)
- [Breaking] support passing in an async function for the test callback [`5f88895`](https://github.com/ljharb/tape/commit/5f8889513f68bc545768ade50a862796c92e36b0)
- [Breaking] support exceptions in async functions [`8d3f03a`](https://github.com/ljharb/tape/commit/8d3f03afede1fef1e73d3ce2ce9ff2c7c2e47319)
- [Tests] update tests for more async/await cases [`197019c`](https://github.com/ljharb/tape/commit/197019c78c0e452852806f330e573f5023eba91c)
- [meta] change dep semver prefix from ~ to ^ [`c3924d3`](https://github.com/ljharb/tape/commit/c3924d34476247e2ba0d6e0781ca89b7d25f2a2b)
- [Breaking] update `deep-equal` to v2 [`898a6e7`](https://github.com/ljharb/tape/commit/898a6e70aadff95f23eb6f7b4e7a1fd24baacc7d)

## [v4.16.1](https://github.com/ljharb/tape/compare/v4.16.0...v4.16.1) - 2022-09-19

### Commits

- [eslint] fix indentation [`b035590`](https://github.com/ljharb/tape/commit/b035590f782c211e93a6a44ed8d0e9d38636a286)
- [meta] add `auto-changelog` [`b467b85`](https://github.com/ljharb/tape/commit/b467b850f169bf294851c68a5c4074360d53a31b)
- [eslint] enforce `no-use-before-define` [`87deb68`](https://github.com/ljharb/tape/commit/87deb68b111fd0d94efc92c25454a6a3fcedff66)
- [eslint] clean up config a bit [`3171edd`](https://github.com/ljharb/tape/commit/3171eddd25dafb3e9a9606ac70ed6c21bb736e8e)
- [Tests] `stackTrace`: use the common `getDiag` utility [`65df5a4`](https://github.com/ljharb/tape/commit/65df5a4f194cf01c3872c713d129ac968342181c)
- [meta] fix repo URLs [`85d86a4`](https://github.com/ljharb/tape/commit/85d86a468af1b74af432d41c204efd4440b5f56f)
- Revert "[Tests] handle a broken error `cause` in node 16.9/16.10" [`775ba37`](https://github.com/ljharb/tape/commit/775ba3789e16b1464dc810243dc5866b2868fc1d)
- [meta] use `npmignore` to autogenerate an npmignore file [`1645abb`](https://github.com/ljharb/tape/commit/1645abbf47df2a8142514302da2730c54b993b47)
- [eslint] enable `func-style` [`75c0c3a`](https://github.com/ljharb/tape/commit/75c0c3a4f9452c36b5318ba6c09ab4ebc97f15d0)
- [readme] fix version badge [`20ea48d`](https://github.com/ljharb/tape/commit/20ea48d53b6492bf648d02d53c41b324abbfb6e1)

## [v4.16.0](https://github.com/ljharb/tape/compare/v4.15.1...v4.16.0) - 2022-08-16

### Commits

- [New] `bin/tape`: include the exact arg when there are no glob results; use require on `--require` files [`6a1ce43`](https://github.com/ljharb/tape/commit/6a1ce4389e8b601249c3c81b31cd60eea3e0f74a)
- [meta] create FUNDING.yml [`5b4752f`](https://github.com/ljharb/tape/commit/5b4752fe006597002918cbd3ee8a4e50f48677ca)
- [Refactor] `bin/tape`: make it a bit more functional, for easier v5 backporting [`fbdbfc9`](https://github.com/ljharb/tape/commit/fbdbfc90dd7afeba89cc3dd5e6280ed247f8b789)
- [Deps] update `glob`, `object-inspect`, `resolve`, `string.prototype.trim` [`6a3c200`](https://github.com/ljharb/tape/commit/6a3c2009e7f6052bd4423dce80bb140e234a877f)
- [Dev Deps] update `@ljharb/eslint-config`, `array.prototype.flatmap`, `es-value-fixtures`, `falafel` [`934d49b`](https://github.com/ljharb/tape/commit/934d49b1e840d3c57bd6e52a74017e06c6a55934)
- [Tests] fix no_only tests on Windows [`f35f71b`](https://github.com/ljharb/tape/commit/f35f71bd44e76eb53bedd63615e59fdc382e4d0d)
- [Robustness] `test` observably looks up `exec` on the object [`4575ca4`](https://github.com/ljharb/tape/commit/4575ca4b185cb503c93e29113b99e10f1ae4b63c)
- [meta] add SECURITY.md [`7b0c901`](https://github.com/ljharb/tape/commit/7b0c901b459b19668fcf6cc5b4b08f42978135b4)

## [v4.15.1](https://github.com/ljharb/tape/compare/v4.15.0...v4.15.1) - 2022-04-08

### Commits

- [Tests] handle a broken error `cause` in node 16.9/16.10 [`53d9e18`](https://github.com/ljharb/tape/commit/53d9e18a93addb2bf70c33cc4ffe8285233a3ad0)
- [Robustness] `test` observably looks up `exec` on the object [`9dbe9ad`](https://github.com/ljharb/tape/commit/9dbe9ad9163835edb302505dec26a8e21f20d893)
- [meta] remove unused travis.yml file [`5a52443`](https://github.com/ljharb/tape/commit/5a52443dcb8c14a9b59523fbb1c05b139833c812)
- [meta] ensure `prelint` works on windows [`48896e8`](https://github.com/ljharb/tape/commit/48896e87cee94d8d704ff2fb2bf730c1c0a94c71)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`3960ccf`](https://github.com/ljharb/tape/commit/3960ccf83722a25131522e35de63b89564eac519)
- [meta] improve `prelint` script when no `.git` dir is present [`7c6dbbd`](https://github.com/ljharb/tape/commit/7c6dbbdba1769bcb80b103d43c3eaa61e395dc52)
- [Deps] update `minimist` [`64677e0`](https://github.com/ljharb/tape/commit/64677e06006e1a1e4e36dc318cc4a36b2152ed95)

## [v4.15.0](https://github.com/ljharb/tape/compare/v4.14.0...v4.15.0) - 2022-01-26

### Merged

- [New] add `--no-only` flag/`NODE_TAPE_NO_ONLY_TEST` [`#572`](https://github.com/ljharb/tape/pull/572)

### Commits

- [New] `t.match`/`t.doesNotMatch: fail the test instead of throw on wrong input types. [`a1c266b`](https://github.com/ljharb/tape/commit/a1c266bf9577420702e1067c40a4a65677add63a)
- [actions] reuse common workflows [`d3b4f46`](https://github.com/ljharb/tape/commit/d3b4f467445bb6da3a2e617c4b29e71528f32425)
- [readme] port changes from v5 [`87f9b29`](https://github.com/ljharb/tape/commit/87f9b293baeb48b507a4e9e16bba62c7ffcc4eb7)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud` [`51ae645`](https://github.com/ljharb/tape/commit/51ae645c8325d6037d4389260a442e27c2efce73)
- [Fix] `bin/tape`: delay requires until needed [`b803fd8`](https://github.com/ljharb/tape/commit/b803fd8e24b1dff96cd43092e727826873c6c571)
- [readme] hard wraps bad, soft wraps good [`82af5ed`](https://github.com/ljharb/tape/commit/82af5ed68577c15526e5dc7ecd290f2e88494170)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`, `array.prototype.flatmap` [`3287a68`](https://github.com/ljharb/tape/commit/3287a68eb1f176a6d0d85390b79c05ffc3c50615)
- [actions] update codecov uploader [`8d6aa6c`](https://github.com/ljharb/tape/commit/8d6aa6c4b084a8cec9860d868ac353862fc8b545)
- [Tests] handle carriage returns in stack traces on Windows [`f79acdf`](https://github.com/ljharb/tape/commit/f79acdfb850d94f71a01970bff96337f52bb4e5a)
- [Deps] update `glob`, `is-regex`, `string.prototype.trim` [`470ca1c`](https://github.com/ljharb/tape/commit/470ca1c0f41155d2c08537bb6cc94e04edd063bc)
- [meta] better `eccheck` command [`fe6978d`](https://github.com/ljharb/tape/commit/fe6978d0a87a881a59ba7de23f2e68ff70d31074)
- [Deps] update `object-inspect`, `resolve` [`50ea080`](https://github.com/ljharb/tape/commit/50ea080561a71d8a6a2d41955441c8a094039227)
- [meta] Exclude `fs` from browser bundles (#565) [`418dc94`](https://github.com/ljharb/tape/commit/418dc94b14b440568fb58aa666df5cb2861fe22c)
- [Tests] handle a broken error `cause` in node 16.9/16.10 [`ca1b906`](https://github.com/ljharb/tape/commit/ca1b90616c2a8fb838b1bd99c90da758c5d80a72)
- [meta] fix `prelint` so it does not fail outside of a git repo [`a09133e`](https://github.com/ljharb/tape/commit/a09133e71d3925bf830f721d05bad72550dd3517)
- [Robustness] use cached `.test` [`86ec0b2`](https://github.com/ljharb/tape/commit/86ec0b262e0405ef0616201c1ffebbc5f278a217)

## [v4.14.0](https://github.com/ljharb/tape/compare/v4.13.3...v4.14.0) - 2021-07-27

### Merged

- [New] add `.teardown()` on `t` instances [`#546`](https://github.com/ljharb/tape/pull/546)
- [readme] add `tape-describe` to 'other' section [`#523`](https://github.com/ljharb/tape/pull/523)

### Fixed

- [New] add `.teardown()` on `t` instances (#546) [`#531`](https://github.com/ljharb/tape/issues/531)
- [readme] add `tape-describe` to 'other' section (#523) [`#522`](https://github.com/ljharb/tape/issues/522)

### Commits

- [Tests] make `stripFullStack` output an array of lines, for better failure messages [`f299759`](https://github.com/ljharb/tape/commit/f2997591a038fa48239f205e40eed5c75278a261)
- [eslint] fully enable `@ljharb` eslint config [`836610d`](https://github.com/ljharb/tape/commit/836610d9772b91a8d31f311834ae1325f2f740bf)
- [actions] use `node/install` instead of `node/run`; use `codecov` action [`46aff81`](https://github.com/ljharb/tape/commit/46aff81f10ad63990f6047c0bdba3be0c90bd3dd)
- [readme] improve `t.throws` documentation [`b36f816`](https://github.com/ljharb/tape/commit/b36f81698fbf4d172a49abb75b9474c4a978df5c)
- [Refactor] avoid reassigning arguments [`5c4052f`](https://github.com/ljharb/tape/commit/5c4052fcf51479320c9482c425a66dcbcc4a509a)
- [Tests] add test case for #519 for test.comment() in createStream/objectMode context [`1700642`](https://github.com/ljharb/tape/commit/17006422fa8189a7e361edfb1e803b73a72b4894)
- [Refactor] use `call-bind/callBound` instead of `function-bind` directly [`967b73f`](https://github.com/ljharb/tape/commit/967b73fe882e9c95c0436e6ce93f24fa3a2e14a9)
- [readme] Another way to create custom reporters [`d81f9f6`](https://github.com/ljharb/tape/commit/d81f9f6681ae72d3425b91e2f7a294e6d4225675)
- [meta] do not publish github action workflow files [`6bb3496`](https://github.com/ljharb/tape/commit/6bb34964abb1e704fe3dcc9fcf8d27d16ff5e296)
- [Refactor] remove unused line, unneeded var initialization; add missing `new` [`da0cdf1`](https://github.com/ljharb/tape/commit/da0cdf1651fec20f66a6bed2d1b17944e18dcd48)
- [Refactor] remove use of legacy `exports` [`a04439c`](https://github.com/ljharb/tape/commit/a04439c3027f3dc0dac8cf8ef5d24a493366be6a)
- [Deps] update `glob`, `is-regex`, `object-inspect`, `resolve`, `string.prototype.trim` [`6e71e6e`](https://github.com/ljharb/tape/commit/6e71e6ea1e009a62546a401a35974ca867a24b9a)
- [eslint] remove useless regex escapes [`1515ff4`](https://github.com/ljharb/tape/commit/1515ff4a8f749aa6d075bffdcda543ca94c559a9)
- [readme] remove travis badge; add actions and codecov badges [`57a7cc9`](https://github.com/ljharb/tape/commit/57a7cc906ec4f24f503350580c5859e5b3e56805)
- [meta] run `aud` in `posttest` [`3907aa5`](https://github.com/ljharb/tape/commit/3907aa560caa2c8d30a6a9168c0d7a3d65a3ba3e)
- [Refactor] generalize error message from calling `.end` more than once [`da8ca46`](https://github.com/ljharb/tape/commit/da8ca46cc0be28a3d4690a4009e0ddec7fc6f779)
- [Tests] handle stack differences in node 15 [`b7b01ec`](https://github.com/ljharb/tape/commit/b7b01ec38ede9f9722b5cce90574782e1eda1305)
- [Deps] update `is-regex`, `object-inspect`, `string.prototype.trim` [`e344080`](https://github.com/ljharb/tape/commit/e344080b1a4b097e1baa1a2b2e843fc283f3f5c2)
- [New] Include name of test in log when test times out (#524) [`78b4d98`](https://github.com/ljharb/tape/commit/78b4d9833a2df7593f653b263588b9a49ca3fe08)
- [Refactor] Avoid setting message property on primitives; use strict mode to catch this [`9dfb680`](https://github.com/ljharb/tape/commit/9dfb680e7543a3a701b3e410bfccbcce3b274d9f)
- [meta] add `safe-publish-latest`; use `prepublishOnly` script for npm 7+ [`c3d434d`](https://github.com/ljharb/tape/commit/c3d434d8b86a0be162efb7fb548f0405239a2688)
- [meta] ensure `not-in-publish`‘s absence does not fail anything [`2a0619d`](https://github.com/ljharb/tape/commit/2a0619d3193287aaa948fc4edf0bb2ccb4150a7b)
- [readme] remove long-dead testling-ci badge [`1461611`](https://github.com/ljharb/tape/commit/1461611bce87b190179d1ac0e2c69438f2b12f31)
- [Tests] ensure bin/tape is linted [`faa51b5`](https://github.com/ljharb/tape/commit/faa51b5baa709ba2e72f78be7cb7ce243c02a771)
- [Dev Deps] update `eslint` [`fad6165`](https://github.com/ljharb/tape/commit/fad6165ae85ebff132daedd1a1bdf3ee307c4ea1)
- [Dev Deps] update `eslint` [`79a0f4b`](https://github.com/ljharb/tape/commit/79a0f4b7b1d0c6db9228cdedf918f20a34dd7762)
- [Tests] exclude examples from coverage [`283f537`](https://github.com/ljharb/tape/commit/283f537f56885d18afbc2328c0c52ee60d528332)

## [v4.13.3](https://github.com/ljharb/tape/compare/v4.13.2...v4.13.3) - 2020-05-24

### Merged

- [Fix] `createStream`: `result` payload is not always an object [`#519`](https://github.com/ljharb/tape/pull/519)
- [Fix] Update RegExp for matching stack frames to handle Promise/then scenario [`#516`](https://github.com/ljharb/tape/pull/516)
- [Tests] Fix simple typo, placehodler -&gt; placeholder [`#500`](https://github.com/ljharb/tape/pull/500)

### Fixed

- [Fix] `createStream`: `result` payload is not always an object (#519) [`#519`](https://github.com/ljharb/tape/issues/519)
- [Fix] Update RegExp for matching stack frames to handle Promise/then scenario (#516) [`#515`](https://github.com/ljharb/tape/issues/515)

### Commits

- [Dev Deps] update `eslint`, `falafel`, `js-yaml` [`9676a21`](https://github.com/ljharb/tape/commit/9676a21784a90a13e29505d86901cd1cd0c1c7db)
- [Deps] update `minimist`, `resolve` [`8887189`](https://github.com/ljharb/tape/commit/8887189c60d956f13f7b54497443bb4be2726748)
- [readme] add `tape-repeater` (#511) [`33712e2`](https://github.com/ljharb/tape/commit/33712e2dd7a89c6c97f58bfe38882631616363c4)
- [examples] add `ecstatic` [`9b87675`](https://github.com/ljharb/tape/commit/9b876753153e0a8f94894fbbe9e08d78df12b039)
- [readme] Add link to tape-player (in-process reporter) (#496) [`bc1334b`](https://github.com/ljharb/tape/commit/bc1334bc008e5d5aecd61c580aad1657932da146)
- [Docs] add an optional emoji version for tap-spec consumer (#501) [`6326dc6`](https://github.com/ljharb/tape/commit/6326dc62e761b92b87377b30c539f762ed2e9052)

## [v4.13.2](https://github.com/ljharb/tape/compare/v4.13.1...v4.13.2) - 2020-03-02

### Merged

- [patch] Print name of test that didnt end [`#498`](https://github.com/ljharb/tape/pull/498)

### Commits

- [Tests] add tests for edge cases and numerics [`4526b39`](https://github.com/ljharb/tape/commit/4526b39834db8061feeeb931dcf06047f29e9970)
- [Tests] sync new test cases from master [`98b2695`](https://github.com/ljharb/tape/commit/98b2695ceebf6e1e175d29f291c9c1073416d947)
- [eslint] enable `quotes` rule [`d686aa2`](https://github.com/ljharb/tape/commit/d686aa2542a3641255a5427408cf4173450b9d6e)
- [Refactor] remove unused code [`e6b6f11`](https://github.com/ljharb/tape/commit/e6b6f119720e7e7b3aa43d72cdfa384f47e76cc2)
- [Deps] update `resolve` [`398503c`](https://github.com/ljharb/tape/commit/398503cfcabbaa56aa1e79d7523815a240d2d775)

## [v4.13.1](https://github.com/ljharb/tape/compare/v4.13.0...v4.13.1) - 2020-01-09

### Fixed

- [Fix] `match`/`doesNotMatch`: when passing, ensure the proper default assert message shows up [`#494`](https://github.com/ljharb/tape/issues/494)

## [v4.13.0](https://github.com/ljharb/tape/compare/v4.12.1...v4.13.0) - 2020-01-07

### Commits

- [New] add `t.match()` and `t.doesNotMatch()`, new in `node` `v13.6` [`0330d82`](https://github.com/ljharb/tape/commit/0330d8254d361b5b47d1ca427447a2ba84f6c2b6)
- [New] `tape` binary: Add -i flag to ignore files from gitignore (#492) [`e0e2542`](https://github.com/ljharb/tape/commit/e0e2542240875e5dad2ba12b1edc4be3251ae571)
- [lint] fix object key spacing [`d7c2fd3`](https://github.com/ljharb/tape/commit/d7c2fd37312cb81109dff7904646692cfb373cb6)
- [Tests] handle stack trace variation in node &lt;= 0.8 [`21ac403`](https://github.com/ljharb/tape/commit/21ac4036eb99af0eb41d88f038af0d4d9623112c)
- [Deps] update `resolve` [`0f15085`](https://github.com/ljharb/tape/commit/0f15085b090ef52176564cbc2a6b7994d38173f5)

## [v4.12.1](https://github.com/ljharb/tape/compare/v4.12.0...v4.12.1) - 2019-12-24

### Commits

- [Fix] error stack file path can contain parens/spaces [`9094271`](https://github.com/ljharb/tape/commit/9094271d8d3813fd18618879be3582a842c0d279)
- [Deps] update `resolve` [`b765bba`](https://github.com/ljharb/tape/commit/b765bba1ea56075d5382b203b6902c8fc5f2d5a6)
- [Dev Deps] update `eslint` [`949781f`](https://github.com/ljharb/tape/commit/949781faf753d5481085f993210738e7b93b3172)

## [v4.12.0](https://github.com/ljharb/tape/compare/v4.11.0...v4.12.0) - 2019-12-16

### Fixed

- [New] when the error type is wrong, show the message and stack [`#479`](https://github.com/ljharb/tape/issues/479)

### Commits

- [Tests] use shared travis-ci configs [`f3a5925`](https://github.com/ljharb/tape/commit/f3a5925bd805e6286731f54ad49f2307ad910dd9)
- [Tests] add a test for the wrong kind of error [`44cbbf5`](https://github.com/ljharb/tape/commit/44cbbf57f343abcf1139f861090c8b200bd80d7a)
- [Deps] update `deep-equal`, `glob`, `object-inspect`, `resolve`, `string.prototype.trim` [`6e94800`](https://github.com/ljharb/tape/commit/6e94800578340a8cab9e0f357c380ab78f09b2cd)
- [Deps] update `is-regex`, `string.prototype.trim` [`3e0a341`](https://github.com/ljharb/tape/commit/3e0a341863952c57c0e7f8ea678ebc471c9c9ef6)
- [Refactor] use `is-regex` instead of `instanceof RegExp` [`8150c3b`](https://github.com/ljharb/tape/commit/8150c3bc55032b0ace9e2fd2c1cd2eeb90710840)
- [Dev Deps] update `eslint` [`ba7e2b2`](https://github.com/ljharb/tape/commit/ba7e2b218b641368eca19d91c11bd8774812416f)
- add tap-nyc to pretty-reporters [`24487cb`](https://github.com/ljharb/tape/commit/24487cb1d99d569b6324050ab58af1a2c0c43f0d)

## [v4.11.0](https://github.com/ljharb/tape/compare/v4.10.2...v4.11.0) - 2019-06-28

### Commits

- [lint] enforce consistent semicolon usage [`a5006ce`](https://github.com/ljharb/tape/commit/a5006ce7460255de659c8caac8959a1086c301f0)
- [New] Add descriptive messages for skipped asserts [`838d995`](https://github.com/ljharb/tape/commit/838d9957354eb4793b64595eff6b71fbf539d758)
- [Fix] emit skipped tests as objects [`8d5dc2f`](https://github.com/ljharb/tape/commit/8d5dc2f17611e73fe48b5eb28db97194cfba61f5)
- [Tests] add tests for 'todo' exit codes [`c6c4ace`](https://github.com/ljharb/tape/commit/c6c4aceccf52fb189732b95fd049b4e110d7868f)
- [meta] clean up license so github can detect it [`861cf55`](https://github.com/ljharb/tape/commit/861cf551175405a0c9f5c33a71d637c6b8ddede9)
- [Refactor] use `!!` over `Boolean()` [`32b5948`](https://github.com/ljharb/tape/commit/32b5948fe71be6008d9142d7303ea5a68e3010a2)
- [Deps] update `inherits`, `resolve` [`9526c2e`](https://github.com/ljharb/tape/commit/9526c2e9d7c4cd354238eb1fe9414a99e225d047)

## [v4.10.2](https://github.com/ljharb/tape/compare/v4.10.1...v4.10.2) - 2019-05-25

### Fixed

- [Refactor] Removed never-read inErrorState from index.js [`#461`](https://github.com/ljharb/tape/issues/461)

### Commits

- [fix] don't consider 'ok' of todo tests in exit code [`15b2dfc`](https://github.com/ljharb/tape/commit/15b2dfcc00f8ae6d94455034b2bf8ffb356e4d1d)
- Minor punctuation/highlighting improvement [`25b4a24`](https://github.com/ljharb/tape/commit/25b4a248b9bf8ced78d65f7775f9043209930078)
- [Dev Deps] update `eslint`, `js-yaml` [`9ec3a0f`](https://github.com/ljharb/tape/commit/9ec3a0faee15583d5cf79e6faeb5f7f22d11ca3a)
- [Deps] update `glob`, `resolve` [`c30e492`](https://github.com/ljharb/tape/commit/c30e49274bab975ced45031b579081bc5cf4904b)
- [meta] set save-prefix to `~` (meant for runtime deps) [`3f337d1`](https://github.com/ljharb/tape/commit/3f337d138527704a7eb02e7ac9d9a35ca35386ee)

## [v4.10.1](https://github.com/ljharb/tape/compare/v4.10.0...v4.10.1) - 2019-02-13

### Fixed

- Partial revert of #403: fbe4b951cb6c6cc4f0e9e3ae4a57b123dd82c0fb and 367b010d21c7c9814c4bc6b21d1c2a9a67596c11 [`#459`](https://github.com/ljharb/tape/issues/459)

### Commits

- [Refactor] consistent spacing [`34ebb4c`](https://github.com/ljharb/tape/commit/34ebb4cb444acbd51715467a4794ccd9e8cedcdb)
- [Deps] update `resolve` [`a63261e`](https://github.com/ljharb/tape/commit/a63261eb81e8cbeeef70ef49486d84dd41190375)

## [v4.10.0](https://github.com/ljharb/tape/compare/v4.9.2...v4.10.0) - 2019-02-09

### Merged

- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)
- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)
- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)
- Fix premature end of tests (and running sibling tests) when test includes subtests [`#403`](https://github.com/ljharb/tape/pull/403)
- [Fix]: only use one test runner for results, even if multiple streams are created [`#404`](https://github.com/ljharb/tape/pull/404)

### Fixed

- Merge pull request #403 from nhamer/issue222 [`#222`](https://github.com/ljharb/tape/issues/222)
- Merge pull request #404 from nhamer/issue105 [`#105`](https://github.com/ljharb/tape/issues/105)
- [Test]: only use one test runner for results, even if multiple streams are created [`#105`](https://github.com/ljharb/tape/issues/105)
- [Fix] Fix premature end of tests (and running sibling tests) when test includes subtests [`#222`](https://github.com/ljharb/tape/issues/222)
- Comments should not make exit code incorrect. Fixes #92 [`#92`](https://github.com/ljharb/tape/issues/92)

### Commits

- Merge all orphaned tags: 'v1.1.2', 'v2.0.2', 'v2.1.1', 'v2.2.2', 'v2.3.3', 'v2.4.3', 'v2.5.1', 'v2.6.1', 'v2.7.3', 'v2.8.1', 'v2.9.1', 'v2.10.3', 'v2.11.1', 'v2.13.4', 'v2.14.0', 'v2.14.1', 'v3.6.1' [`6209882`](https://github.com/ljharb/tape/commit/6209882aaf646c787ccf72244e8ebb04a9c95556)
- [New] Implements TAP TODO directive [`5cdaf54`](https://github.com/ljharb/tape/commit/5cdaf548b9b1d19c638e937ada10d550290a07c0)
- Minor test tweaks due to output differences in v1 vs v4. [`d22b5fc`](https://github.com/ljharb/tape/commit/d22b5fc48f7053dbf3bc1f4804783a61534edf33)
- Minor test tweaks due to whitespace differences in v3 vs v4. [`7ed6651`](https://github.com/ljharb/tape/commit/7ed6651b984fa8da66e3014b93bc1beda57bee9b)
- [Refactor] Avoid adding a new observable method to the API. [`fbe4b95`](https://github.com/ljharb/tape/commit/fbe4b951cb6c6cc4f0e9e3ae4a57b123dd82c0fb)
- Minor test tweaks due to whitespace differences in v2 vs v4. [`6ce09d9`](https://github.com/ljharb/tape/commit/6ce09d9a27c00ed4cee566feb13886b61f067d90)
- [Tests] missing t.end(); avoid shadowing [`144a361`](https://github.com/ljharb/tape/commit/144a36184b8edeb8f586fd1f257bcc8ecf483476)
- [Fix] Stop createStream for creating additional test runner loops [`b494b18`](https://github.com/ljharb/tape/commit/b494b188dc4f909ec7ca085e299fefe247d7b1c0)
- hats, has module [`6ecc842`](https://github.com/ljharb/tape/commit/6ecc842e53a8c25c93323c1f1a41bd4966346041)
- [Dev Deps] update `eslint`, `js-yaml` [`9e3d25e`](https://github.com/ljharb/tape/commit/9e3d25ec41a0c29d173c6451a30ff19fb8b699ff)
- [Fix] windows: Show failure location even if driver letter is lowercase [`fb548b3`](https://github.com/ljharb/tape/commit/fb548b33bc9ec01a4f0242da3345f5f86e90e97d)
- Add missing `concat-stream` devDep [`8b3c1b7`](https://github.com/ljharb/tape/commit/8b3c1b7f76a8b7ac8165cac08105bd0ac390e867)
- [New] add alias 'notDeepEquals' to 'notDeepEqual' function [`35844e6`](https://github.com/ljharb/tape/commit/35844e6143da924b5bba5e67dd0b5914298461f2)
- [Deps] update `glob` [`82e7b26`](https://github.com/ljharb/tape/commit/82e7b266565d080a9cb3bfa7bb18be7029813b9c)
- [Docs] Add tape-promise into 'other' [`d15bc4b`](https://github.com/ljharb/tape/commit/d15bc4b693f26824c03fbd647bc4fea89a4af5e2)
- [Docs] Add an alternative ES6 tape runner [`aac3e70`](https://github.com/ljharb/tape/commit/aac3e70c29cfd6dd4ff559741a9a43abf918a741)
- better travis yml [`066542a`](https://github.com/ljharb/tape/commit/066542a8a0d7ec4e8c1f3a5aabfba6eb01abf9f9)
- do not set canEmitExit with browserify process shim [`a28db7e`](https://github.com/ljharb/tape/commit/a28db7eb238f679591d6019a1511b4ebfab8ec39)
- do not set canEmitExit with browserify process shim [`ebdbba6`](https://github.com/ljharb/tape/commit/ebdbba6cd9daabd981538646f27fa152f77c2c20)
- do not set canEmitExit with browserify process shim [`4f33ae5`](https://github.com/ljharb/tape/commit/4f33ae5f9236f9fc8a4f4f88390ae5400de821a7)
- do not set canEmitExit with browserify process shim [`0e47a93`](https://github.com/ljharb/tape/commit/0e47a9359b9e6df0d5fd7bc1d17d7d8159b5d218)
- do not set canEmitExit with browserify process shim [`ff3e84f`](https://github.com/ljharb/tape/commit/ff3e84f94f1e4b26bab4aabeee2c1f8ed1015684)
- do not set canEmitExit with browserify process shim [`7164a03`](https://github.com/ljharb/tape/commit/7164a031b828c0493175867b92e69512f9223867)
- do not set canEmitExit with browserify process shim [`40cf488`](https://github.com/ljharb/tape/commit/40cf48878991e0d66509e1f36f4c191265c77ea0)
- do not set canEmitExit with browserify process shim [`d282191`](https://github.com/ljharb/tape/commit/d282191d2657d37cfb8d8e1250dba06744b349e7)
- do not set canEmitExit with browserify process shim [`59fd1dc`](https://github.com/ljharb/tape/commit/59fd1dc6aa4e3c2c399c727b3e9324038dbf87ca)
- do not set canEmitExit with browserify process shim [`87eb6bc`](https://github.com/ljharb/tape/commit/87eb6bc455a6d931f5bf0efa0fefb5e710360e10)
- do not set canEmitExit with browserify process shim [`c9d502e`](https://github.com/ljharb/tape/commit/c9d502ec3da3971e34e4493593506c17ec466fcf)
- do not set canEmitExit with browserify process shim [`66c0a7d`](https://github.com/ljharb/tape/commit/66c0a7d6a48498ae58df7ecc75c4f3cfa39eb08e)
- gitignore node_modules [`71af8ba`](https://github.com/ljharb/tape/commit/71af8ba72437da9324e25a4606d340f4508a4ebf)
- gitignore node_modules [`3495543`](https://github.com/ljharb/tape/commit/3495543d1cdd2bab3676bf23b09cb319f0b02954)
- [Docs] link to mixed tape [`8a7567a`](https://github.com/ljharb/tape/commit/8a7567ae54a7f057f7016f76b5f7cef354e011b4)
- [Docs] Add electron-tap [`5c36aa8`](https://github.com/ljharb/tape/commit/5c36aa862b7b356cd773ae09016039d4b523f304)
- [Docs] Mention [`flip-tape`](https://github.com/pguth/flip-tape/blob/master/README.md) in the section "other". [`1693c34`](https://github.com/ljharb/tape/commit/1693c341abf44462dc0a83aed68ed976a7fc1ad5)

## [v4.9.2](https://github.com/ljharb/tape/compare/v4.9.1...v4.9.2) - 2018-12-29

### Merged

- [Docs] Clarify doesNotThrow parameters [`#450`](https://github.com/ljharb/tape/pull/450)
- Update README: convert list of tap reporters to links [`#439`](https://github.com/ljharb/tape/pull/439)

### Fixed

- [Fix] notEqual and notDeepEqual show "expected" value on failure [`#453`](https://github.com/ljharb/tape/issues/453)

### Commits

- Convert list of tap reporters to links [`4337f58`](https://github.com/ljharb/tape/commit/4337f5878dedadf430e0e4c8146f3c6a691f5cda)
- [Docs] Updated readme to make test, test.only and test.skip consistent. [`75c467e`](https://github.com/ljharb/tape/commit/75c467eff9b4beba9f9ce5bc186853495b871fdc)
- [Dev Deps] update `eslint`, `eclint` [`4b9c951`](https://github.com/ljharb/tape/commit/4b9c951b1629ccb95b42900fb953d18032844b74)
- Clarify doesNotThrow parameters [`f53e3f1`](https://github.com/ljharb/tape/commit/f53e3f14cdc5cd2f4551d0114dffb481f87a65aa)
- [readme] Change broken image to use web archive [`b1df632`](https://github.com/ljharb/tape/commit/b1df632b408418fcdcb266383c889cd2567f843b)
- [Docs] cleanup from #439 [`5f1c5a2`](https://github.com/ljharb/tape/commit/5f1c5a2f07a0aaa48b44764b32cca61566d10442)
- Adding tap-junit [`96de340`](https://github.com/ljharb/tape/commit/96de340ce96683a4789884eb83412e5f36640f19)

## [v4.9.1](https://github.com/ljharb/tape/compare/v4.9.0...v4.9.1) - 2018-06-07

### Merged

- [docs] Add tap-react-browser [`#433`](https://github.com/ljharb/tape/pull/433)

### Commits

- [Tests] add eclint and eslint, to enforce a consistent style [`c6f5313`](https://github.com/ljharb/tape/commit/c6f5313217bc0b553ccab9a70a195b26881b63d8)
- [fix] Fix bug in functionName regex during stack parsing [`ec4a71d`](https://github.com/ljharb/tape/commit/ec4a71d7c94a3692e5b42aa51d4a553d39fa8796)
- [Dev Deps] use ~ for dev deps; update to latest nonbreaking [`9d501ff`](https://github.com/ljharb/tape/commit/9d501ff25b20f9318cda741c88cf50d469175da5)
- [Deps] update `has`, `for-each`, `resolve`, `object-inspect` [`8a2d29b`](https://github.com/ljharb/tape/commit/8a2d29bc8adcd179ccef15a551f0df35fa3ab6c1)
- Add tap-react-browser [`6cbc53e`](https://github.com/ljharb/tape/commit/6cbc53ee1599cf54489dc66291a126d764ea68cf)
- [Dev Deps] update `js-yaml` [`73232c0`](https://github.com/ljharb/tape/commit/73232c01ef4d794c6c502e4f5a349d8fb26e2eeb)
- [Dev Deps] update `concat-stream` [`45788a5`](https://github.com/ljharb/tape/commit/45788a520f922397726958a37ab51dcaa6eb1b35)
- Fix spelling of "parameterize" [`24e0a8d`](https://github.com/ljharb/tape/commit/24e0a8d079ce9f68daf2ec0c00010facc383cca5)

## [v4.9.0](https://github.com/ljharb/tape/compare/v4.8.0...v4.9.0) - 2018-02-18

### Merged

- [New] use `process.env.NODE_TAPE_OBJECT_PRINT_DEPTH` for the default object print depth [`#420`](https://github.com/ljharb/tape/pull/420)
- Add "onFailure" listener to test harness. [`#408`](https://github.com/ljharb/tape/pull/408)
- normalize path separators in stripFullStack [`#402`](https://github.com/ljharb/tape/pull/402)
- Check added stack trace parts for filename match [`#387`](https://github.com/ljharb/tape/pull/387)
- Fix dirname in stack traces [`#388`](https://github.com/ljharb/tape/pull/388)
- Use local reference for clearTimeout global [`#385`](https://github.com/ljharb/tape/pull/385)

### Fixed

- [Fix] fix stack where actual is falsy [`#399`](https://github.com/ljharb/tape/issues/399)

### Commits

- Handle spaces in path name for setting file, line no [`bf5a750`](https://github.com/ljharb/tape/commit/bf5a750937df4920ab9e2e965be02ac69dd43f72)
- Update tests to correctly reference (or ignore) at prop [`d165142`](https://github.com/ljharb/tape/commit/d16514294623c710598a015fee233271e6bfee2c)
- Test for anonymous function wrapper [`6015599`](https://github.com/ljharb/tape/commit/601559949295fa6479d877ec5a69ef3dac419f52)
- Test name with spaces [`3c2087a`](https://github.com/ljharb/tape/commit/3c2087a214cd9f0086bc12ec1ec24b1ab02293a0)
- Add "onFinish" listener to test harness. [`00aa133`](https://github.com/ljharb/tape/commit/00aa1339b61eca78e2a4c52e22cbfdd08deef06a)
- [New] use `process.env.NODE_TAPE_OBJECT_PRINT_DEPTH` for the default object print depth. [`17276d7`](https://github.com/ljharb/tape/commit/17276d7473f9d98e37bab47ebdddf74ca1931f43)
- Handle stack variation in Node v0.8 [`a5fb7ed`](https://github.com/ljharb/tape/commit/a5fb7eda4cde3880bd07b23efb177bae11124768)
- [Tests] on `node` `v9`; use `nvm install-latest-npm` [`4919e40`](https://github.com/ljharb/tape/commit/4919e409e8a7c9d78a3abf0cea33a3549bb24fbc)
- Update existing tests to properly reference anonymous names [`f619f60`](https://github.com/ljharb/tape/commit/f619f604af08075b7c758c77924fdda8f2967704)
- Provide placeholder names for anonymous functions [`32faf70`](https://github.com/ljharb/tape/commit/32faf707e770f63071823f4a97122d7724d57aa9)
- [Deps] update `object-inspect`, `resolve` [`6867840`](https://github.com/ljharb/tape/commit/686784059075888fb6190fe790b2f873ef6b17fb)
- Reverse engineer error for at prop too [`1eba217`](https://github.com/ljharb/tape/commit/1eba217edbbdb84104ceac493062729fc3fe20fd)
- normalize path separators in stacks [`f90e487`](https://github.com/ljharb/tape/commit/f90e487aad2d787b6d725186e37bf352110dd97d)
- [Dev Deps] update `js-yaml` [`0e68b2d`](https://github.com/ljharb/tape/commit/0e68b2d1ff44929ea56c291fa24d9083e3151f84)
- [Deps] update `function-bind` [`b66f8f8`](https://github.com/ljharb/tape/commit/b66f8f80928bb82f0817407880a139ad118daf01)
- Use lib directory instead of package root for stacktrace checking [`b6f5aaf`](https://github.com/ljharb/tape/commit/b6f5aaff16144520c182ab33bd915fe14159a913)
- correct spelling mistake [`fde8216`](https://github.com/ljharb/tape/commit/fde82161a9e53cb104f94a8b41c40af00cbcaee4)

## [v4.8.0](https://github.com/ljharb/tape/compare/v4.7.0...v4.8.0) - 2017-07-31

### Commits

- [Deps] update `resolve`, `object-inspect` [`b50084c`](https://github.com/ljharb/tape/commit/b50084ccb22c2de3c51bdbdc62ae788443b10483)
- [Dev Deps] update `js-yaml` [`c82c593`](https://github.com/ljharb/tape/commit/c82c593d8cba15abfd7914f418e677ccfc23eaf6)
- updates README.md and adds tap-html [`bd6db7b`](https://github.com/ljharb/tape/commit/bd6db7b123a3a7e7c12bd2816b1840ed418a9d2a)

## [v4.7.0](https://github.com/ljharb/tape/compare/v4.6.3...v4.7.0) - 2017-06-26

### Merged

- Fix spurious "test exited without ending" [`#374`](https://github.com/ljharb/tape/pull/374)

### Fixed

- [Fix] fix spurious "test exited without ending" [`#223`](https://github.com/ljharb/tape/issues/223)

### Commits

- [New] show full error stack on failure [`9302682`](https://github.com/ljharb/tape/commit/93026823b0606021adac0042ef2da6865607ee90)
- [Cleanup] elses need cuddles [`995ddb2`](https://github.com/ljharb/tape/commit/995ddb254ab5e6048b4d049b902601b597ff24e0)
- [Tests] fix thrower stack in node 0.8 [`8b3a77e`](https://github.com/ljharb/tape/commit/8b3a77e595b8ee328d016fa12c773e9e7299910a)
- [Tests] fix stack differences on node 0.8 [`c7859a2`](https://github.com/ljharb/tape/commit/c7859a274b823823b4de1522959d2c06a1f3bd2b)
- [Tests] on `node` `v8`; no need for sudo; `v0.8` passes now; allow v5/v7/iojs to fail. [`e030260`](https://github.com/ljharb/tape/commit/e030260c86e48afd3edf8bd77bb048975f348eff)
- Only apps should have lock files. [`df48bfa`](https://github.com/ljharb/tape/commit/df48bfae19d8ba4b48055dacac8b81912b8887f2)
- [Tests] npm v4.6+ breaks on node &lt; v1 [`35e47e1`](https://github.com/ljharb/tape/commit/35e47e1652dca17af9abfbb9050753dfe9c91ea0)
- [Refactor] instead of throwing on `undefined.forEach`, throw explicitly. [`b06f914`](https://github.com/ljharb/tape/commit/b06f9140729e61fad95daf5b765d77809b304f96)
- [Deps] update `glob`, `resolve` [`1a8e936`](https://github.com/ljharb/tape/commit/1a8e936235d8cf8269ce0683786761286a129bd8)
- [Dev Deps] update `falafel`, `js-yaml` [`7eb9e36`](https://github.com/ljharb/tape/commit/7eb9e3638743bd513bc69ae3f7db61401d68f7e5)
- [Dev Deps] update `concat-stream`, `js-yaml` [`e6d4625`](https://github.com/ljharb/tape/commit/e6d4625e175a42e3694a88a7061dc9e3f593cd37)
- [Tests] npm v5+ breaks on node &lt; v4 [`4375661`](https://github.com/ljharb/tape/commit/4375661d4de9fb69da93e981c97f3d1eeda55871)
- [Deps] update `object-inspect` [`dc1ffa5`](https://github.com/ljharb/tape/commit/dc1ffa5c8e7486a15b785ff0f14b34ef879a8d57)
- [Deps] update `resolve` [`66519cb`](https://github.com/ljharb/tape/commit/66519cb1f018c50676b889ae8980fdd67a21de18)
- tap-min moved to derhuerst/tap-min [`bdf2b04`](https://github.com/ljharb/tape/commit/bdf2b04e8262eba2797acf7927b93f5b329ffe67)
- [Dev Deps] update `tap` [`5ec88e7`](https://github.com/ljharb/tape/commit/5ec88e736adbf85f05b7a3bb34caa452ed644e53)

## [v4.6.3](https://github.com/ljharb/tape/compare/v4.6.2...v4.6.3) - 2016-11-21

### Commits

- [Tests] on `node` `v7` [`a4cc2fe`](https://github.com/ljharb/tape/commit/a4cc2fe3e67c3c07bfcdbf244d46c9c68b29e6aa)
- [Fix] don’t assume `Array#forEach`, for ES3. [`cc9cc30`](https://github.com/ljharb/tape/commit/cc9cc304b60864d76e9a9efdd4e90003502cafff)
- [Dev Deps] update `js-yaml`, `tap-parser` [`a80e655`](https://github.com/ljharb/tape/commit/a80e655d9f03c26f1bb454927cbc8ba1f5679f2a)
- [Deps] update `glob` [`9b27d19`](https://github.com/ljharb/tape/commit/9b27d19c7de6151af356ade4876841595276d211)

## [v4.6.2](https://github.com/ljharb/tape/compare/v4.6.1...v4.6.2) - 2016-09-30

### Fixed

- [Fix] if someone throws `null`/`undefined`, it shouldn’t crash [`#324`](https://github.com/ljharb/tape/issues/324)

## [v4.6.1](https://github.com/ljharb/tape/compare/v4.6.0...v4.6.1) - 2016-09-29

### Merged

- Fix for not showing path for error messages on windows [`#316`](https://github.com/ljharb/tape/pull/316)
- [Tests] [Dev Deps] Update to latest version of devDependencies tap (v7) and tap-parser (v2) [`#318`](https://github.com/ljharb/tape/pull/318)
- [Fix] `.only` should not run multiple tests with the same name. [`#303`](https://github.com/ljharb/tape/pull/303)

### Fixed

- [Fix] `throws`: only reassign “message” when it is not already non-enumerable. [`#320`](https://github.com/ljharb/tape/issues/320)
- update devDpendencies to latest: tap (v7) and tap-parser (v2) fixes #312 [`#312`](https://github.com/ljharb/tape/issues/312)
- update tap & tap-parser to latest versions fixes #312 (update devDependencies) [`#312`](https://github.com/ljharb/tape/issues/312)
- Merge pull request #303 from jtlapp/ref-based-only [`#299`](https://github.com/ljharb/tape/issues/299)

### Commits

- update test/exit.js to use concat-stream instead of tap.createConsumer (method unvailable in tap v7) for #312 [`78e4ffd`](https://github.com/ljharb/tape/commit/78e4ffd6e5108907ed1389546e78414d88e42cc4)
- update test/require.js to use concat-stream instead of tap.createConsumer (method method unavailable in tap v7) see: https://github.com/substack/tape/issues/312#issuecomment-242740448 [`8826099`](https://github.com/ljharb/tape/commit/882609917f2a9739198e5f09c4262ab990e2964e)
- update test/end-as-callback.js to use concat-stream instead of tap.createCosumer (method unavailable in tap v7) for #312 [`be10880`](https://github.com/ljharb/tape/commit/be1088077b09d511eba5ce3704541801aa894028)
- udpate test/nested.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) #312 [`1211a3a`](https://github.com/ljharb/tape/commit/1211a3afba139f91ae43939680565f499301dfe3)
- update test/too_many.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) see: https://github.com/substack/tape/issues/312#issuecomment-242740448 [`5f89509`](https://github.com/ljharb/tape/commit/5f89509559176ee49db3b5ae812324a292614425)
- update test/fail.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) see #312 [`b9ab50e`](https://github.com/ljharb/tape/commit/b9ab50ea47a72d61331d9fc55d684b3aa919d393)
- update test/array.js to use concat-stream instead of tap.createConsumer() (no longer available in tap v7) [`00e595a`](https://github.com/ljharb/tape/commit/00e595a511d0c15b7cf191c6e46ee3ea464d39ed)
- update test/nested-sync-noplan-noend.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) for #312 [`45ae6c1`](https://github.com/ljharb/tape/commit/45ae6c106e7fa729ec9e5e475c12c9672c5a1324)
- update test/default-messages.js to use concat-stream instead of tap.createConsumer() (no longer available in tap v7) #312 [`eb30f50`](https://github.com/ljharb/tape/commit/eb30f50930eecfe49ca64a1ec41305bdca84358a)
- update test/timeoutAfter.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) see: https://github.com/substack/tape/issues/312#issuecomment-242740448 [`db3a45e`](https://github.com/ljharb/tape/commit/db3a45eda8a855a87478e7533602fd1d8c787d17)
- update test/only.js to use concat-stream instead of tap.createConsumer (method unavailable in tap v7) for #312 [`c1807c2`](https://github.com/ljharb/tape/commit/c1807c26efc475fa8838e72891e47efcc45b1374)
- .only now identifies tests by reference instead of by test name, fixing #299 [`289b590`](https://github.com/ljharb/tape/commit/289b59005706dbedf572c9d209681656664c7bde)
- Separate tap extensions by category [`6978df4`](https://github.com/ljharb/tape/commit/6978df4fde57d2cbab517f479794cf3f4a84f482)
- In docs, clarified when 'msg' describes the assertion. Also clarified 'expected' in throws(). [`e532790`](https://github.com/ljharb/tape/commit/e532790dd690ac8936d642b1392b14cba91e2569)
- remove redundant tests from test/skip.js - still testing the documented API adequately [`aa021eb`](https://github.com/ljharb/tape/commit/aa021eb616cde1a547995ac0ffef02b73895ba04)
- remove redundant tests in test/throws.js (assertion unchanged! tests pass) for #312 [`fd7eb30`](https://github.com/ljharb/tape/commit/fd7eb30bea4328cebeaa38d9bea4c21c47f12e5e)
- Fix for unit tests on windows [`baca83c`](https://github.com/ljharb/tape/commit/baca83c59361a6fb3baf5f5e0ef967c9eb80e124)
- update test/max_listeners.js to use path.join for cross-platform compatibility see: https://github.com/substack/tape/pull/314#discussion_r76651627 [`1bac623`](https://github.com/ljharb/tape/commit/1bac623d0df9250aede8ba091e87688fa4b31b02)
- [Dev Deps] update `falafel`, `tap-parser` [`50f462e`](https://github.com/ljharb/tape/commit/50f462e7a8acd4c5cd9cdebd2a25d52ab16e49bd)
- [Dev Deps] update `tap`, `tap-parser` [`ea9dcb7`](https://github.com/ljharb/tape/commit/ea9dcb78c91c6905c2bce0bf804475d2a9d3b4df)
- update test/double_end.js to use path.join for cross-platform compatibility see: https://github.com/substack/tape/pull/314#discussion_r76651627 [`e3115ff`](https://github.com/ljharb/tape/commit/e3115ff6c23398c3a9486a51bebd41656e3d6f2e)
- [Deps] update `glob` [`6369b77`](https://github.com/ljharb/tape/commit/6369b778c15f72c4d8954527d076b3d0ede0bf74)
- [Tests] ensure the max_listeners test has passing output. [`918e217`](https://github.com/ljharb/tape/commit/918e217c03febe3f8b7c12cc5d6a133745698cd0)
- [Deps] update `inherits` [`96552cf`](https://github.com/ljharb/tape/commit/96552cff15ab5a5072b9343cf476c8d3e1e95452)
- [Dev Deps] update `concat-stream` [`47507a0`](https://github.com/ljharb/tape/commit/47507a065e7e905180a0c9883b59d87a4b4d4154)
- [Deps] update `glob` [`8608d59`](https://github.com/ljharb/tape/commit/8608d598cbcf14f575494bb1e0eeed2dd22a7f5a)
- Fix bug from #303 / 289b59005706dbedf572c9d209681656664c7bde [`092344b`](https://github.com/ljharb/tape/commit/092344b906cd3774ba1812d2db431e77916c9f19)
- initialized _only to null [`07da71b`](https://github.com/ljharb/tape/commit/07da71b3e08d4f8c07e8c6e5796c1859a4f116ce)
- [Dev Deps] update `glob` [`fb600ee`](https://github.com/ljharb/tape/commit/fb600eed777a8b4c712005eeda49b2edc0449a70)
- Added travis ci support for node 6 [`d5e1a5e`](https://github.com/ljharb/tape/commit/d5e1a5ef42ae838951bdc41a9d494c6278576d75)

## [v4.6.0](https://github.com/ljharb/tape/compare/v4.5.1...v4.6.0) - 2016-06-19

### Fixed

- [Robustness] be robust against the global `setTimeout` changing. [`#292`](https://github.com/ljharb/tape/issues/292)
- [Tests] add some tests with `throws` and RegExp matching. [`#269`](https://github.com/ljharb/tape/issues/269)

### Commits

- [results] make object-inspect depth configurable for expected/actual [`a196915`](https://github.com/ljharb/tape/commit/a1969156ca4ed81ffc2cc338f8d905fb65ae1604)
- add message defaults to .ok() and .notOk() [`91b639c`](https://github.com/ljharb/tape/commit/91b639c360eef0c31a7b25e788311c7bfeb981a1)
- Add test for deep loose equal. [`5060034`](https://github.com/ljharb/tape/commit/5060034b6ceae1f08bc552029bab5bbc5199f7b9)
- [Deps] update `glob`, `object-inspect` [`5492dee`](https://github.com/ljharb/tape/commit/5492dee269ee4af5bd19fd558a41badaa986641e)
- [Dev Deps] update `js-yaml` [`03bf9b6`](https://github.com/ljharb/tape/commit/03bf9b63948df5e4733559f9db091543869bbe09)
- [Deps] update `glob` [`1f82954`](https://github.com/ljharb/tape/commit/1f829546b7cfbc167d150c1594de19f6aaabca5c)
- Update readme.markdown [`7ea6373`](https://github.com/ljharb/tape/commit/7ea6373848e37efb3acc3f4898f084d96d7994ee)
- link build badge to master branch [`a2c0f2e`](https://github.com/ljharb/tape/commit/a2c0f2eff3b00c9057c243e2b57b673209d9aaf0)
- [Dev Deps] update `js-yaml` [`b194ab1`](https://github.com/ljharb/tape/commit/b194ab17670a1dfbb3f9c99a638a46dd7e9b84e7)

## [v4.5.1](https://github.com/ljharb/tape/compare/v4.5.0...v4.5.1) - 2016-03-06

### Merged

- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)

### Fixed

- Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#267`](https://github.com/ljharb/tape/issues/267)

## [v4.5.0](https://github.com/ljharb/tape/compare/v4.4.1...v4.5.0) - 2016-03-02

### Merged

- Test on Node.js v0.10.x, v0.12.x, v4.x, and v5.x [`#238`](https://github.com/ljharb/tape/pull/238)
- [Docs] Fix readme formatting [`#233`](https://github.com/ljharb/tape/pull/233)

### Fixed

- [Tests] remove unnecessary + failing Error message assertion [`#255`](https://github.com/ljharb/tape/issues/255)

### Commits

- [New] Skipped test blocks should output a “SKIP” message. [`1414948`](https://github.com/ljharb/tape/commit/1414948acaeb0a3b39e77b78a0ea94725756142c)
- [Deps] update `deep-equal`, `function-bind`, `glob`, `object-inspect`, `resolve`, `string.prototype.trim`, `through` [`13654ad`](https://github.com/ljharb/tape/commit/13654addc410056b6dd48a35352deaa167b5bb98)
- [Dev Deps] update `concat-stream`, `falafel`, `js-yaml`, `tap-parser` [`9a6b655`](https://github.com/ljharb/tape/commit/9a6b6559013ee732472b5e81bd106994121a068d)
- doc: Explain opts in t.test [`545db26`](https://github.com/ljharb/tape/commit/545db260ee27e7121eed42e963973038013b4bd4)
- [Tests] building C extensions on iojs 3 and greater doesn’t work on a stock sudoless travis-ci VM. [`40be685`](https://github.com/ljharb/tape/commit/40be68520fedee580462bfaa7e91651154a65bea)
- Fix readme formatting [`69dada1`](https://github.com/ljharb/tape/commit/69dada15d940f9925e4e9a4ff6c71039d497c2cd)
- Travis: Get rid of sudo [`95848f4`](https://github.com/ljharb/tape/commit/95848f4a361168a429c1b16dc6988f90f8a413a0)
- Add back iojs [`0f51449`](https://github.com/ljharb/tape/commit/0f5144995a3bdd4eff81f294b7b8537116856a8a)

## [v4.4.1](https://github.com/ljharb/tape/compare/v4.4.0...v4.4.1) - 2015-12-30

### Merged

- Multiline comments [`#228`](https://github.com/ljharb/tape/pull/228)
- [Docs] Fix a typo in the README [`#229`](https://github.com/ljharb/tape/pull/229)

### Commits

- Exploratory comments to ascertain current behavior [`cc3b58e`](https://github.com/ljharb/tape/commit/cc3b58e632f9f5344bcc3e9637ab1c019e5d2d37)
- Failing test for new functionality [`0132b1d`](https://github.com/ljharb/tape/commit/0132b1db156fae25bb40dc09ec178217a1be4d0a)
- Added test case for Windows line endings [`c66f25e`](https://github.com/ljharb/tape/commit/c66f25e32696df21a7f59153ea3e7db3480fcc4e)
- Removed unnecessary cast [`3a5417a`](https://github.com/ljharb/tape/commit/3a5417a1032287d35dad65d40c896b0bc625060f)
- Fix a typo in the README [`b8e4002`](https://github.com/ljharb/tape/commit/b8e4002d18559542af4117432d91a38e8f9ba63d)

## [v4.4.0](https://github.com/ljharb/tape/compare/v4.3.0...v4.4.0) - 2015-12-25

### Merged

- Issue175 [`#212`](https://github.com/ljharb/tape/pull/212)
- Removed unreachable Results.prototype.only code [`#217`](https://github.com/ljharb/tape/pull/217)

### Fixed

- rename tearDown to onFinish [`#175`](https://github.com/ljharb/tape/issues/175)
- add tape.tearDown handler [`#175`](https://github.com/ljharb/tape/issues/175)

### Commits

- document onFinish hook [`2795763`](https://github.com/ljharb/tape/commit/279576302ab34ed93190eddbe7778fc712adca4f)

## [v4.3.0](https://github.com/ljharb/tape/compare/v4.2.2...v4.3.0) - 2015-12-22

### Merged

- Add flag to require modules before running tests [`#224`](https://github.com/ljharb/tape/pull/224)
- Add few tap reporters [`#213`](https://github.com/ljharb/tape/pull/213)
- Add ES6 support link to documentation. [`#204`](https://github.com/ljharb/tape/pull/204)

### Commits

- This implements `-r` and `--require` as command line options [`7ae60f5`](https://github.com/ljharb/tape/commit/7ae60f5ff63b6bfd9c7811eb8977ed60bfeaa5ac)
- Add `-r,--require` documentation to README.md [`096d2e7`](https://github.com/ljharb/tape/commit/096d2e70bf7c73123156f6ffe3044e81adce7e1b)
- Revert "Remove unneeded whitespaces in README" [`35c6c08`](https://github.com/ljharb/tape/commit/35c6c089034add8ea6f47ef9f0d3a58e6c94dce7)
- Remove unneeded whitespaces in README [`3ed9b91`](https://github.com/ljharb/tape/commit/3ed9b91616426ac0ab5dc16274019ce70a5b3e2c)
- Use regular ol' `if` instead of boolean operator in sanity check [`ffa503a`](https://github.com/ljharb/tape/commit/ffa503ad8acb22fe3108748189c0e1888511d8ba)
- Make single require check more readable [`d0ca885`](https://github.com/ljharb/tape/commit/d0ca885a1f1e646a886aaae243c40ae03b3cc94f)
- Unquote keys in object literals [`9f02249`](https://github.com/ljharb/tape/commit/9f02249f1e99f88eae26d39527768820f9b58c89)
- Use ~ for minimist and resolve dependency versions. [`4f81dbc`](https://github.com/ljharb/tape/commit/4f81dbc5f9344b3dc9d56943d96249577d39f852)
- Fix spelling mistake in comment [`4077efe`](https://github.com/ljharb/tape/commit/4077efe19fe914a4b344ce3da1710478bed5f734)
- Fix indent mistake [`2e57f22`](https://github.com/ljharb/tape/commit/2e57f22b9690e828c42f6d3c28e22c3f01948ea7)
- Revert "Added rudimentary source map support" [`3f02033`](https://github.com/ljharb/tape/commit/3f02033f6024a526951ed6ad7606bdcb6d589f91)
- Added rudimentary source map support [`737aa42`](https://github.com/ljharb/tape/commit/737aa4273e43e5c5faa825729c4f5ecb2e3ab519)
- Add "tap-diff" and "tap-notify" to README [`77a2bbb`](https://github.com/ljharb/tape/commit/77a2bbb40397d66557bf1c7aa3cdee8b30adbd5c)

## [v4.2.2](https://github.com/ljharb/tape/compare/v4.2.1...v4.2.2) - 2015-10-20

### Merged

- Move timeout option to run time, not load time [`#202`](https://github.com/ljharb/tape/pull/202)

## [v4.2.1](https://github.com/ljharb/tape/compare/v4.2.0...v4.2.1) - 2015-10-02

### Merged

- Travis: Add Node v4 [`#195`](https://github.com/ljharb/tape/pull/195)
- add tape-dom link to the readme [`#189`](https://github.com/ljharb/tape/pull/189)

### Commits

- Use `string.prototype.trim` instead of relying on `String#trim`, for ES3. [`77e1848`](https://github.com/ljharb/tape/commit/77e184843f955722e261f81e50c5cc10f06784fd)
- Bumping `defined` to v1.0.0 - no implementation change, just follows semver now. [`0e407f0`](https://github.com/ljharb/tape/commit/0e407f05d66c6e29ef26989d659db99b86b40a64)
- Add Node v4 [`df62458`](https://github.com/ljharb/tape/commit/df624584d8420848bfcb340a62701dcd717867af)

## [v4.2.0](https://github.com/ljharb/tape/compare/v4.1.0...v4.2.0) - 2015-08-14

### Commits

- Use `has` instead of a homegrown version of the same. [`e82c1e8`](https://github.com/ljharb/tape/commit/e82c1e8e7a5d5ad420fc9efc8accfaa11b7dd12c)
- Use `function-bind` to ensure we're robust against modification of `Function#call` [`88d567c`](https://github.com/ljharb/tape/commit/88d567cdd9fcc0f7016029b8aa97e8439edb85c4)

## [v4.1.0](https://github.com/ljharb/tape/compare/v4.0.3...v4.1.0) - 2015-08-12

### Merged

- improve yaml formating of diagnostic information [`#171`](https://github.com/ljharb/tape/pull/171)
- Expose the main test harness [`#170`](https://github.com/ljharb/tape/pull/170)

### Fixed

- Expose the main harness's results object [`#148`](https://github.com/ljharb/tape/issues/148)

### Commits

- improve yaml formatting of diagnostic information [`b73d2bf`](https://github.com/ljharb/tape/commit/b73d2bfb69364f5332f5958bca2c69099aedc290)
- Exposing the whole test harness [`fc889f5`](https://github.com/ljharb/tape/commit/fc889f56b418fbb30150d517ed7d8b8aa5b943d4)

## [v4.0.3](https://github.com/ljharb/tape/compare/v4.0.2...v4.0.3) - 2015-08-06

### Commits

- Cache `Object.prototype.hasOwnProperty` here also. [`3eda12c`](https://github.com/ljharb/tape/commit/3eda12c110980a8348c23c0e544ab74fd1318693)

## [v4.0.2](https://github.com/ljharb/tape/compare/v4.0.1...v4.0.2) - 2015-08-03

### Merged

- Comments should not make exit code incorrect. Fixes #92 [`#168`](https://github.com/ljharb/tape/pull/168)
- Added --save-dev to install instruction [`#166`](https://github.com/ljharb/tape/pull/166)

### Fixed

- Merge pull request #168 from grit96/issue-92 [`#92`](https://github.com/ljharb/tape/issues/92)
- Comments should not make exit code incorrect. Fixes #92 [`#92`](https://github.com/ljharb/tape/issues/92)

## [v4.0.1](https://github.com/ljharb/tape/compare/v4.0.0...v4.0.1) - 2015-07-19

### Merged

- Add info about bin usage to readme. [`#156`](https://github.com/ljharb/tape/pull/156)
- Clarify comment documentation [`#153`](https://github.com/ljharb/tape/pull/153)

### Commits

- Cache `Object#hasOwnProperty` in case clients break it as part of tests [`f9a8088`](https://github.com/ljharb/tape/commit/f9a8088b93dfed09ae1a6e3be614e3e03ef8eed2)

## [v4.0.0](https://github.com/ljharb/tape/compare/v3.6.1...v4.0.0) - 2015-04-03

### Fixed

- Expand reporters section into "things that go well with tape" [`#147`](https://github.com/ljharb/tape/issues/147)
- Update dependencies [`#93`](https://github.com/ljharb/tape/issues/93)

### Commits

- Drop 0.8 support [`cf56a13`](https://github.com/ljharb/tape/commit/cf56a1336f90a0dcac7f5a9afa4afc09e00bfb8b)

## [v3.6.1](https://github.com/ljharb/tape/compare/v3.6.0...v3.6.1) - 2016-03-06

### Merged

- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)

### Commits

- Minor test tweaks due to whitespace differences in v3 vs v4. [`7ed6651`](https://github.com/ljharb/tape/commit/7ed6651b984fa8da66e3014b93bc1beda57bee9b)

## [v3.6.0](https://github.com/ljharb/tape/compare/v3.5.1...v3.6.0) - 2015-04-02

### Merged

- Only check for errors in callback if exist [`#149`](https://github.com/ljharb/tape/pull/149)
- Added tap-difflet to README [`#139`](https://github.com/ljharb/tape/pull/139)
- Fixed typo in README [`#146`](https://github.com/ljharb/tape/pull/146)

### Commits

- fix test [`7329ddc`](https://github.com/ljharb/tape/commit/7329ddc629b44b22ef0724da846f81de7c49dab1)
- Remove this extra test I mistakenly committed [`4b1e452`](https://github.com/ljharb/tape/commit/4b1e452ea64cd4e25f91ea6155e6888dbc513382)
- Add documentation of test.comment [`04bb03e`](https://github.com/ljharb/tape/commit/04bb03eeda4e2369b1d4c277aeaf811117b5e126)
- only ifError if we have an err value [`4205104`](https://github.com/ljharb/tape/commit/4205104c47c211d1b52547d4922bdd3def8b56e4)

## [v3.5.1](https://github.com/ljharb/tape/compare/v3.5.0...v3.5.1) - 2015-02-05

### Merged

- add caught guard to avoid referencing undefined property [`#145`](https://github.com/ljharb/tape/pull/145)

## [v3.5.0](https://github.com/ljharb/tape/compare/v3.4.0...v3.5.0) - 2015-01-30

### Merged

- Detect `inErrorState` with code not equal to zero [`#138`](https://github.com/ljharb/tape/pull/138)
- Fixing backwards t.end explanation [`#142`](https://github.com/ljharb/tape/pull/142)
- adds note on t.end(arg) behavior [`#141`](https://github.com/ljharb/tape/pull/141)

## [v3.4.0](https://github.com/ljharb/tape/compare/v3.3.0...v3.4.0) - 2015-01-18

### Merged

- Add a Function.constructor check to throws. [`#130`](https://github.com/ljharb/tape/pull/130)
- remove unused require [`#131`](https://github.com/ljharb/tape/pull/131)
- Add section about uncaught exceptions to readme. [`#134`](https://github.com/ljharb/tape/pull/134)

### Commits

- add t.throws(fn, Function) [`13efd54`](https://github.com/ljharb/tape/commit/13efd546192dcc7fd58abdafe6f6831c9e1e269c)

## [v3.3.0](https://github.com/ljharb/tape/compare/v3.2.0...v3.3.0) - 2015-01-18

### Merged

- Improve at error detection [`#133`](https://github.com/ljharb/tape/pull/133)
- Add timeoutAfter method [`#132`](https://github.com/ljharb/tape/pull/132)

### Commits

- Add timeoutAfter method to Test [`926122a`](https://github.com/ljharb/tape/commit/926122a14823605b2881dbb12b35bc76904c8fa4)
- Add opts to readme [`ea6dc65`](https://github.com/ljharb/tape/commit/ea6dc65c059683b32dea8c7456bed9ad95007e59)
- Support timeout in opts [`7133ca5`](https://github.com/ljharb/tape/commit/7133ca5fdba8df304f259342468fb143c7dcd565)
- Add timeoutAfter to readme [`00a8ba8`](https://github.com/ljharb/tape/commit/00a8ba85255d9be9dc1cf6c1d00e501418dc7ea8)
- Add .gitignore [`9fb9423`](https://github.com/ljharb/tape/commit/9fb94232b211accc97f971946412e5ab0ec2eb86)

## [v3.2.0](https://github.com/ljharb/tape/compare/v3.1.0...v3.2.0) - 2015-01-15

## [v3.1.0](https://github.com/ljharb/tape/compare/v3.0.3...v3.1.0) - 2015-01-15

### Merged

- Remove uncaught-exception listener [`#127`](https://github.com/ljharb/tape/pull/127)
- Adding tap-xunit to reporters. [`#123`](https://github.com/ljharb/tape/pull/123)

### Commits

- Remove uncaught-exception. [`dd661b0`](https://github.com/ljharb/tape/commit/dd661b0b4bddce16b1d92c8d8faca10cca4bcaf6)
- Add back to do not call exit() if error semantics. [`9c60d32`](https://github.com/ljharb/tape/commit/9c60d320a58016f3f914f30eb468aa5e3a9a3c2e)
- Adding a tap-xunit to reporters. [`ca27f59`](https://github.com/ljharb/tape/commit/ca27f594ea3bc12c81a667ca019fb31a37ff7b60)

## [v3.0.3](https://github.com/ljharb/tape/compare/v3.0.2...v3.0.3) - 2014-11-11

### Commits

- notLooseEquals should be !deepEqual [`5121547`](https://github.com/ljharb/tape/commit/5121547ab28ac6b16be594772680a3364956e2d9)

## [v3.0.2](https://github.com/ljharb/tape/compare/v3.0.1...v3.0.2) - 2014-11-05

### Merged

- Change "a,b" into "actual,expected" [`#114`](https://github.com/ljharb/tape/pull/114)

## [v3.0.1](https://github.com/ljharb/tape/compare/v3.0.0...v3.0.1) - 2014-10-17

### Commits

- Fixes global leak `prop` [`9eb3ecd`](https://github.com/ljharb/tape/commit/9eb3ecd8a0637d55d120656f64ddc09c18debfac)

## [v3.0.0](https://github.com/ljharb/tape/compare/v2.14.1...v3.0.0) - 2014-09-17

### Merged

- Document that expected must be a RegExp [`#101`](https://github.com/ljharb/tape/pull/101)
- Asynchronously declared nested tests w/ plan() w/o end() [`#98`](https://github.com/ljharb/tape/pull/98)

### Commits

- remove failing throw test [`672b8d3`](https://github.com/ljharb/tape/commit/672b8d30f9c528c635ff273bf8e08870e4009a30)
- remove try catch [`b747374`](https://github.com/ljharb/tape/commit/b74737415c98be5e68fcd28213d86c3e32433a05)

## [v2.14.1](https://github.com/ljharb/tape/compare/v2.14.0...v2.14.1) - 2016-03-06

### Merged

- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)

### Commits

- Minor test tweaks due to whitespace differences in v2 vs v4. [`6ce09d9`](https://github.com/ljharb/tape/commit/6ce09d9a27c00ed4cee566feb13886b61f067d90)
- gitignore node_modules [`71af8ba`](https://github.com/ljharb/tape/commit/71af8ba72437da9324e25a4606d340f4508a4ebf)

## [v2.14.0](https://github.com/ljharb/tape/compare/v2.13.4...v2.14.0) - 2014-08-05

### Commits

- hats, has module [`6ecc842`](https://github.com/ljharb/tape/commit/6ecc842e53a8c25c93323c1f1a41bd4966346041)
- better travis yml [`066542a`](https://github.com/ljharb/tape/commit/066542a8a0d7ec4e8c1f3a5aabfba6eb01abf9f9)

## [v2.13.4](https://github.com/ljharb/tape/compare/v2.13.3...v2.13.4) - 2014-07-19

### Fixed

- Comments should not make exit code incorrect. Fixes #92 [`#92`](https://github.com/ljharb/tape/issues/92)

## [v2.13.3](https://github.com/ljharb/tape/compare/v2.13.2...v2.13.3) - 2014-06-12

### Merged

- Add a section about reports to the README [`#89`](https://github.com/ljharb/tape/pull/89)

### Commits

- add colortape [`467ce7a`](https://github.com/ljharb/tape/commit/467ce7a19686fc61aaad9633df64319ec416d61d)

## [v2.13.2](https://github.com/ljharb/tape/compare/v2.13.1...v2.13.2) - 2014-06-02

### Commits

- FIX: handling `if (extra.parent)` when parent == 0 [`9579246`](https://github.com/ljharb/tape/commit/9579246f09a274747fefbd8b358e94774acb85be)

## [v2.13.1](https://github.com/ljharb/tape/compare/v2.13.0...v2.13.1) - 2014-05-17

### Commits

- test if fs.writeSync is defined and on windows [`b28520c`](https://github.com/ljharb/tape/commit/b28520cdd0dad25ddeaecc4660a2797b47ff42bd)
- write sync to stdout [`14ab9d1`](https://github.com/ljharb/tape/commit/14ab9d1ad38bd619a60e60269db66d724f4bd99c)
- formatting [`ffcff1e`](https://github.com/ljharb/tape/commit/ffcff1e8bce257f0d50cd99906ab96286ea50d35)

## [v2.13.0](https://github.com/ljharb/tape/compare/v2.12.3...v2.13.0) - 2014-05-15

### Commits

- Bind all test methods [`1ca29e2`](https://github.com/ljharb/tape/commit/1ca29e26ea7821ed30be982494c3e9d3c3100c06)
- Test that we can call assertion functions directly [`f9774cc`](https://github.com/ljharb/tape/commit/f9774cc078142081c0133e090723f27cad367534)
- Fix Test constructor so that it doesn't accidentally mutate global scope [`ba3bcbb`](https://github.com/ljharb/tape/commit/ba3bcbb8a62194ee79f814ff688065c6041cb0ed)
- formatting [`aacd7a9`](https://github.com/ljharb/tape/commit/aacd7a90d1ac5f306ffaf66d21884e2cff941408)

## [v2.12.3](https://github.com/ljharb/tape/compare/v2.12.2...v2.12.3) - 2014-04-04

### Commits

- Remove dependency on util builtin [`d39b0eb`](https://github.com/ljharb/tape/commit/d39b0ebaa6639d4d9ca568547ef977259d10d465)

## [v2.12.2](https://github.com/ljharb/tape/compare/v2.12.1...v2.12.2) - 2014-04-02

## [v2.12.1](https://github.com/ljharb/tape/compare/v2.12.0...v2.12.1) - 2014-03-29

### Commits

- do not set canEmitExit with browserify process shim [`0212262`](https://github.com/ljharb/tape/commit/0212262b2c80665486219e92c2ab421aa8907715)

## [v2.12.0](https://github.com/ljharb/tape/compare/v2.11.1...v2.12.0) - 2014-03-23

### Commits

- switches are weird [`aae89ee`](https://github.com/ljharb/tape/commit/aae89ee56d2a7b47c6a074c8a8ca7a1b66a7f0a7)
- Moving the name/opts/cb code out into a reusable internal function. [`88e296f`](https://github.com/ljharb/tape/commit/88e296ff8179f9f270c0eefdf2f4cacb17c933d4)
- Adding Test.skip. [`f9aa185`](https://github.com/ljharb/tape/commit/f9aa1856d377fb80ec0b8e955964d562696a6cd6)

## [v2.11.1](https://github.com/ljharb/tape/compare/v2.11.0...v2.11.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`a28db7e`](https://github.com/ljharb/tape/commit/a28db7eb238f679591d6019a1511b4ebfab8ec39)

## [v2.11.0](https://github.com/ljharb/tape/compare/v2.10.3...v2.11.0) - 2014-03-21

### Commits

- upgrade object-inspect [`30cd35c`](https://github.com/ljharb/tape/commit/30cd35cbda79bf5c302650dd619327410a0eeae8)

## [v2.10.3](https://github.com/ljharb/tape/compare/v2.10.2...v2.10.3) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`ebdbba6`](https://github.com/ljharb/tape/commit/ebdbba6cd9daabd981538646f27fa152f77c2c20)

## [v2.10.2](https://github.com/ljharb/tape/compare/v2.10.1...v2.10.2) - 2014-03-04

### Commits

- fix trailing comma [`71adf6a`](https://github.com/ljharb/tape/commit/71adf6a50fdc2fc76b81350fd72ffecf574f8777)

## [v2.10.1](https://github.com/ljharb/tape/compare/v2.10.0...v2.10.1) - 2014-03-04

### Commits

- merged [`29437f7`](https://github.com/ljharb/tape/commit/29437f7805064ef41a7128c92bb6b1c826eb8042)

## [v2.10.0](https://github.com/ljharb/tape/compare/v2.9.1...v2.10.0) - 2014-03-04

### Commits

- passing nested test [`db1baf0`](https://github.com/ljharb/tape/commit/db1baf02bc1982fa177e99c39e08fa2224708156)
- subcount test [`e98ead5`](https://github.com/ljharb/tape/commit/e98ead5752c64ea958393fa0782209c978b1f92f)
- glob files in the runner [`c9da9ff`](https://github.com/ljharb/tape/commit/c9da9ff9c446eae438703608e8c02b9a09b60da8)

## [v2.9.1](https://github.com/ljharb/tape/compare/v2.9.0...v2.9.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`4f33ae5`](https://github.com/ljharb/tape/commit/4f33ae5f9236f9fc8a4f4f88390ae5400de821a7)

## [v2.9.0](https://github.com/ljharb/tape/compare/v2.8.1...v2.9.0) - 2014-03-04

### Commits

- complete double end test [`45add17`](https://github.com/ljharb/tape/commit/45add173cf5ed739fae31a90c64eb3d8b308260e)
- omit expected and actual if there is no actual or expected [`b6ac9bf`](https://github.com/ljharb/tape/commit/b6ac9bf80615ffcda4b9a3a16e8792dee3db1d89)
- failing test for calling .end() twice [`c0a9a29`](https://github.com/ljharb/tape/commit/c0a9a297abd168d4fa0ae2b29897d30ab532b121)
- guard against calling .end() twice [`8d25028`](https://github.com/ljharb/tape/commit/8d25028500e76d49e907fc118dd2a6a9502d7071)

## [v2.8.1](https://github.com/ljharb/tape/compare/v2.8.0...v2.8.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`0e47a93`](https://github.com/ljharb/tape/commit/0e47a9359b9e6df0d5fd7bc1d17d7d8159b5d218)

## [v2.8.0](https://github.com/ljharb/tape/compare/v2.7.3...v2.8.0) - 2014-03-04

### Commits

- remove .bind(), formatting [`7092104`](https://github.com/ljharb/tape/commit/7092104828b58d6ddb409211b1606ee5f42a1236)

## [v2.7.3](https://github.com/ljharb/tape/compare/v2.7.2...v2.7.3) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`ff3e84f`](https://github.com/ljharb/tape/commit/ff3e84f94f1e4b26bab4aabeee2c1f8ed1015684)

## [v2.7.2](https://github.com/ljharb/tape/compare/v2.7.1...v2.7.2) - 2014-03-04

### Commits

- another only test, passes [`ff3c79b`](https://github.com/ljharb/tape/commit/ff3c79b51a345f4815bb45182d464e3e8b14f049)
- fix for test.only only2 test [`40cad7d`](https://github.com/ljharb/tape/commit/40cad7d313b9513b6e3ab4a4d4cafbe9c9b94934)
- failing test.only test [`412d169`](https://github.com/ljharb/tape/commit/412d16988e47cfce7cba27c94ac2bba70cefc6e3)

## [v2.7.1](https://github.com/ljharb/tape/compare/v2.7.0...v2.7.1) - 2014-03-04

### Commits

- fix wrong package name [`d5f87c0`](https://github.com/ljharb/tape/commit/d5f87c030c8ac1f96ba98d38cdb96f17a79f42cb)

## [v2.7.0](https://github.com/ljharb/tape/compare/v2.6.1...v2.7.0) - 2014-03-04

### Merged

- Clarify how to access the output stream [`#65`](https://github.com/ljharb/tape/pull/65)

### Fixed

- Clarify how to access the output stream [`#63`](https://github.com/ljharb/tape/issues/63)

### Commits

- using object-inspect for comparisons, passing the undef test [`49963b3`](https://github.com/ljharb/tape/commit/49963b3d1abf71e72a4a71f40c271bc9afe13d78)
- failing undef test [`9ee8421`](https://github.com/ljharb/tape/commit/9ee84219bde718af19cdd7f14d268fd59530c024)
- update docs [`984b21f`](https://github.com/ljharb/tape/commit/984b21fbbb5b3bf2c1a1cfc2fea33894ec042619)

## [v2.6.1](https://github.com/ljharb/tape/compare/v2.6.0...v2.6.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`7164a03`](https://github.com/ljharb/tape/commit/7164a031b828c0493175867b92e69512f9223867)

## [v2.6.0](https://github.com/ljharb/tape/compare/v2.5.1...v2.6.0) - 2014-03-03

### Commits

- documented custom reporters [`7572828`](https://github.com/ljharb/tape/commit/75728289fa5e3b00103662e820cb1319c4cef2ef)
- objectMode for stream output [`26c05e3`](https://github.com/ljharb/tape/commit/26c05e33e7a2ee4e157f6049ed6ee712cbe3da6a)
- .createStream() for tap output on the default harness [`5d2cd63`](https://github.com/ljharb/tape/commit/5d2cd6319dc33696b874c9908d28eab195eff675)
- stream example [`47848f2`](https://github.com/ljharb/tape/commit/47848f2dd52f09b4cc0752b87d15529590517d69)
- only render the test events right before they begin [`9da8dff`](https://github.com/ljharb/tape/commit/9da8dff8670f73f8a57fa636947aea3b687a9edd)

## [v2.5.1](https://github.com/ljharb/tape/compare/v2.5.0...v2.5.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`40cf488`](https://github.com/ljharb/tape/commit/40cf48878991e0d66509e1f36f4c191265c77ea0)

## [v2.5.0](https://github.com/ljharb/tape/compare/v2.4.3...v2.5.0) - 2014-02-20

### Fixed

- Fixes #55 - Callback optional. [`#55`](https://github.com/ljharb/tape/issues/55)

### Commits

- No callback is equivalent to skipping. [`9f7a2d0`](https://github.com/ljharb/tape/commit/9f7a2d0516d316e9128abbb737376f59c7dae647)

## [v2.4.3](https://github.com/ljharb/tape/compare/v2.4.2...v2.4.3) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`d282191`](https://github.com/ljharb/tape/commit/d282191d2657d37cfb8d8e1250dba06744b349e7)

## [v2.4.2](https://github.com/ljharb/tape/compare/v2.4.1...v2.4.2) - 2014-02-01

### Commits

- Reduce stack size. [`3b05526`](https://github.com/ljharb/tape/commit/3b0552657177cd56635b19b135021342d4fecb2c)
- re-indent. Fuck whichever editor does this by default. [`52f3541`](https://github.com/ljharb/tape/commit/52f3541e8610af4534997ace0339b417434d2e66)

## [v2.4.1](https://github.com/ljharb/tape/compare/v2.4.0...v2.4.1) - 2014-01-31

### Commits

- should throw --&gt; should not throw for the doesNotThrow assertion [`04f3751`](https://github.com/ljharb/tape/commit/04f37515d27b0ce846f108f72930da28b45a6100)

## [v2.4.0](https://github.com/ljharb/tape/compare/v2.3.3...v2.4.0) - 2014-01-29

### Commits

- remove the browser compat section since there is already a giant testling badge [`fe3fe96`](https://github.com/ljharb/tape/commit/fe3fe9648ab5fef5e0a8e2c76e1cb2d378667d1e)
- upgrade deep-equal to 0.2.0 [`dcf6b46`](https://github.com/ljharb/tape/commit/dcf6b46b1cadfebea25ef34f26719734349b742d)
- drop require stream [`97fede5`](https://github.com/ljharb/tape/commit/97fede5b5cc1746a53c15d26d75a6c3381a6f32b)

## [v2.3.3](https://github.com/ljharb/tape/compare/v2.3.2...v2.3.3) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`59fd1dc`](https://github.com/ljharb/tape/commit/59fd1dc6aa4e3c2c399c727b3e9324038dbf87ca)

## [v2.3.2](https://github.com/ljharb/tape/compare/v2.3.1...v2.3.2) - 2013-12-17

### Commits

- fix to define the stream so it can emit errors [`00af8ed`](https://github.com/ljharb/tape/commit/00af8ed795202356b172fcd8b48b8d64037397c4)

## [v2.3.1](https://github.com/ljharb/tape/compare/v2.3.0...v2.3.1) - 2013-12-17

### Commits

- drop split and stream-combiner to make the default stream not drop newlines in ie&lt;9 [`ea56255`](https://github.com/ljharb/tape/commit/ea562557b7598c13ce498a64d47b299e967d04bc)

## [v2.3.0](https://github.com/ljharb/tape/compare/v2.2.2...v2.3.0) - 2013-11-22

### Commits

- suppress EPIPE but set the exit code to 1 so test results may be piped around to head/grep/tail [`1589695`](https://github.com/ljharb/tape/commit/158969558f9d1376344a15ba6bb590cae41609a7)

## [v2.2.2](https://github.com/ljharb/tape/compare/v2.2.1...v2.2.2) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`87eb6bc`](https://github.com/ljharb/tape/commit/87eb6bc455a6d931f5bf0efa0fefb5e710360e10)

## [v2.2.1](https://github.com/ljharb/tape/compare/v2.2.0...v2.2.1) - 2013-11-22

### Commits

- forgot the resumer dep [`9882d34`](https://github.com/ljharb/tape/commit/9882d3499d3157a230bccebd9476202a04b37c0e)

## [v2.2.0](https://github.com/ljharb/tape/compare/v2.1.1...v2.2.0) - 2013-11-22

### Commits

- is now properly noisy when more commits than expected were run [`2954dac`](https://github.com/ljharb/tape/commit/2954dacdef87324ae0a192deac194f83c6200441)
- rip out the old `new Stream` default stream to just use split, duplexer, and through [`021da85`](https://github.com/ljharb/tape/commit/021da85e63a6748fc85825663c6db69a2a370451)
- properly fixed the default stream [`2ce40f5`](https://github.com/ljharb/tape/commit/2ce40f57216d647ca49f86c4b717aa1a1fc36774)

## [v2.1.1](https://github.com/ljharb/tape/compare/v2.1.0...v2.1.1) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`c9d502e`](https://github.com/ljharb/tape/commit/c9d502ec3da3971e34e4493593506c17ec466fcf)

## [v2.1.0](https://github.com/ljharb/tape/compare/v2.0.2...v2.1.0) - 2013-10-25

### Commits

- Refactor test-ordering logic [`48964a6`](https://github.com/ljharb/tape/commit/48964a6b479df326248dfe8ddeb056a667ea5f55)
- Count subtests against the plan [`978431c`](https://github.com/ljharb/tape/commit/978431c8a6db8cf3925a8b1b95a771aa872b9283)
- Add nested-sync-noplan-noend [`8449f1c`](https://github.com/ljharb/tape/commit/8449f1c1600eec44153eab0b430bd00e50598d40)
- Add test for async asserts in subtests ref #42 [`9d64ad3`](https://github.com/ljharb/tape/commit/9d64ad33a9e74d48614136e0ec54e1f2eac01dad)
- Add failing test for planning # of subtests [`bc03743`](https://github.com/ljharb/tape/commit/bc037437d658b050347220c0f8c2ff101d669dd9)
- Remove comment block [`2c06852`](https://github.com/ljharb/tape/commit/2c068521e2db12327ee381cb09a5a2b81af7d06c)
- Revert "Add test for running children asynchronously" [`c39be29`](https://github.com/ljharb/tape/commit/c39be29cd9063497506b63e27ba715e3101ca666)
- Add test for running children asynchronously [`709c36a`](https://github.com/ljharb/tape/commit/709c36afe5d9aef36a35cc0dbb461bcfe8714a94)
- add test for asynchronously adding subtests [`8b59a80`](https://github.com/ljharb/tape/commit/8b59a8010fb4441f9fc5f17c70d06ddb903d7aae)
- Add second @spion patch [`35f29a8`](https://github.com/ljharb/tape/commit/35f29a8d12857e28a04acc374682704a0359c942)
- Revert "Add patch from @spion to make nested-sync-noplan-noend pass" [`a43860b`](https://github.com/ljharb/tape/commit/a43860b1225e43c2894cf85472f22ec5d5e31c94)
- Add patch from @spion to make nested-sync-noplan-noend pass [`188fbb1`](https://github.com/ljharb/tape/commit/188fbb15456774a917619f95af8d04dfcd28f1b2)
- Remove 'next' event [`78e48c9`](https://github.com/ljharb/tape/commit/78e48c9fa90d1326abb5623b08f7617bfd730a47)
- Add checks against double-execution of child tests [`cfff35b`](https://github.com/ljharb/tape/commit/cfff35b68a5d2701c08d32797bb73d92eabb3bed)

## [v2.0.2](https://github.com/ljharb/tape/compare/v2.0.1...v2.0.2) - 2014-04-02

### Commits

- do not set canEmitExit with browserify process shim [`66c0a7d`](https://github.com/ljharb/tape/commit/66c0a7d6a48498ae58df7ecc75c4f3cfa39eb08e)

## [v2.0.1](https://github.com/ljharb/tape/compare/v2.0.0...v2.0.1) - 2013-10-25

### Commits

- toStringified msg to prevent TypeError [`37305c2`](https://github.com/ljharb/tape/commit/37305c2626c430bebdb646fddab91c30b2d3c247)

## [v2.0.0](https://github.com/ljharb/tape/compare/v1.1.2...v2.0.0) - 2013-10-14

### Commits

- strict deep equal comparisons [`95f827d`](https://github.com/ljharb/tape/commit/95f827d8121cc751ba6c9f7d66bc8626105e0792)
- document strict/loose deep equals [`785be99`](https://github.com/ljharb/tape/commit/785be995ef8165c0c67534429f9de879512a9bb0)
- failing deep strict equal test [`d56754a`](https://github.com/ljharb/tape/commit/d56754a281edc6d9f9eac5b563cb8668952b8d09)

## [v1.1.2](https://github.com/ljharb/tape/compare/v1.1.1...v1.1.2) - 2016-03-06

### Merged

- [Fix] Ensure that non-functions passed to `throws` fail the test, just like `assert` [`#268`](https://github.com/ljharb/tape/pull/268)

### Commits

- Minor test tweaks due to output differences in v1 vs v4. [`d22b5fc`](https://github.com/ljharb/tape/commit/d22b5fc48f7053dbf3bc1f4804783a61534edf33)
- Add missing `concat-stream` devDep [`8b3c1b7`](https://github.com/ljharb/tape/commit/8b3c1b7f76a8b7ac8165cac08105bd0ac390e867)
- gitignore node_modules [`3495543`](https://github.com/ljharb/tape/commit/3495543d1cdd2bab3676bf23b09cb319f0b02954)

## [v1.1.1](https://github.com/ljharb/tape/compare/v1.1.0...v1.1.1) - 2013-09-20

### Commits

- Fix at printing [`fae125e`](https://github.com/ljharb/tape/commit/fae125e13e55ffcd4481cebdf86a009457cc5eda)

## [v1.1.0](https://github.com/ljharb/tape/compare/v1.0.4...v1.1.0) - 2013-09-03

### Commits

- test.only should not run any other test blocks [`1f56566`](https://github.com/ljharb/tape/commit/1f565663ec945f06e225ba3b11787687ffdc2b13)
- failing test for t.only() firing tests unnecessarily [`bd3f198`](https://github.com/ljharb/tape/commit/bd3f198946f9010e01a9ae55733aef1eef7b1532)
- fix typoes [`8cf5c67`](https://github.com/ljharb/tape/commit/8cf5c675a5b2be726fd483eb09e0fc7417919d99)

## [v1.0.4](https://github.com/ljharb/tape/compare/v1.0.3...v1.0.4) - 2013-06-08

### Commits

- re-throw error to get it to show [`a51e872`](https://github.com/ljharb/tape/commit/a51e87240d2c12f57f9608f982e4c653c0e028ce)

## [v1.0.3](https://github.com/ljharb/tape/compare/v1.0.2...v1.0.3) - 2013-06-07

### Commits

- do not call process.exit() on uncaught exception [`3801e20`](https://github.com/ljharb/tape/commit/3801e2051aaa2ea404cbb4beedfcce00fec234eb)

## [v1.0.2](https://github.com/ljharb/tape/compare/v1.0.1...v1.0.2) - 2013-05-08

### Commits

- cant lazy load only. Has to be a property of the exported thing [`c5a4731`](https://github.com/ljharb/tape/commit/c5a4731b29ea16cd4f1b40fb2d968937ce1215eb)
- Add the only property back to the exported test function [`d22deba`](https://github.com/ljharb/tape/commit/d22deba6da4da8b94e7a3a352eb029afecdaaadf)

## [v1.0.1](https://github.com/ljharb/tape/compare/v1.0.0...v1.0.1) - 2013-05-03

### Commits

- forgot to add a test [`40b229a`](https://github.com/ljharb/tape/commit/40b229a9b5727bebf79299c2bca8e784f33888a2)
- forgot to add through [`d729135`](https://github.com/ljharb/tape/commit/d729135b33e22b18e10416a837067f4eaa248485)

## [v1.0.0](https://github.com/ljharb/tape/compare/v0.3.3...v1.0.0) - 2013-05-03

### Commits

- took out lots of complexity, refactoring [`827b59d`](https://github.com/ljharb/tape/commit/827b59d281ece73859ac77524d0e5857f5070436)
- basic example finally works [`2a59c49`](https://github.com/ljharb/tape/commit/2a59c49ec44c7d8e56adf5b6951e1271293dd343)
- removing harness test, not sure why it's broken on 0.8 [`bd9e9a6`](https://github.com/ljharb/tape/commit/bd9e9a6aefa7f7129131a98dda3966d58d8a1c08)
- nested test nearly works [`7951747`](https://github.com/ljharb/tape/commit/7951747f2f8b38a60c2a5b76a8f86741ebf8191b)
- refactor exit logic [`890382d`](https://github.com/ljharb/tape/commit/890382dd3509d5817fc0a65a4df5f5cadbfd9a91)
- fixed for the two example [`0ac88b8`](https://github.com/ljharb/tape/commit/0ac88b870c99dc3d9e6280f839d7023ecd922fe0)
- use a createStream() function instead of .stream [`6417cdc`](https://github.com/ljharb/tape/commit/6417cdcd90ac712f8a5f3f849f93518cc59cac52)
- fix harness test [`fa706ae`](https://github.com/ljharb/tape/commit/fa706aeb59bb9627b0b6740a795241d6c76dfe91)
- no longer getting already closed errors by tracking the number of running tests [`c9def14`](https://github.com/ljharb/tape/commit/c9def140ee0f7d3d44dc9c3e2b420192090d1c90)
- child ordering output is now correct [`5544d26`](https://github.com/ljharb/tape/commit/5544d26ddd36047db3d5ac699f3c4f6158e63dc7)
- only test passes [`4fbabba`](https://github.com/ljharb/tape/commit/4fbabba2478d263a8adeb2b3d4314ab06f9874c9)
- check for end and call ._exit() if unended [`ce0d62c`](https://github.com/ljharb/tape/commit/ce0d62c5a58de42959d35ebec5a65598432dd179)
- fixed the many test, broke the exit test [`72e34ad`](https://github.com/ljharb/tape/commit/72e34ad9e2eb4314b914d8a74222b263a8221dc1)
- passing one more of the exit tests [`5ec8f42`](https://github.com/ljharb/tape/commit/5ec8f42bcfbfa15edfeb04b1d632d9c9316bad68)
- nested test at least finishes now [`6252fd2`](https://github.com/ljharb/tape/commit/6252fd201e7cb73036249130112ffc4ec2dc2372)
- fix default harness going off unexpectedly [`b1c1d6a`](https://github.com/ljharb/tape/commit/b1c1d6a15e14e975cd0c0792d7c5d2a696c3cae3)
- special case for exiting, all tests pass now [`88de699`](https://github.com/ljharb/tape/commit/88de69987bb25fbf9ed18b1b7168488752a3af2e)
- passing the skip test [`876930e`](https://github.com/ljharb/tape/commit/876930ecea8b26f056c7c9f2e12f08f7017bcdce)
- update the tests to use createStream [`9420e07`](https://github.com/ljharb/tape/commit/9420e07f324b01b0e7453b2341f55987945df816)
- check pause status before resuming [`606b141`](https://github.com/ljharb/tape/commit/606b14118e0d810adc780d27031406aa90f91c1b)
- nested example completely works [`a5e709e`](https://github.com/ljharb/tape/commit/a5e709eb86c946f2e79a758c14778583dc764ea8)
- only the exported harness will be piped to the default stream [`6df7fc0`](https://github.com/ljharb/tape/commit/6df7fc0766bb9c15b83403e46e6e0a6e68645f64)
- exit test completely passes [`f37d431`](https://github.com/ljharb/tape/commit/f37d431ff3f6f1fc3ca0cb602806628afca401bf)
- fixed the nested test [`4f05679`](https://github.com/ljharb/tape/commit/4f056797d7003cb4a3cbbb85275257779ce34a4f)
- getting further into the child ordering test [`8a80302`](https://github.com/ljharb/tape/commit/8a80302a2f34274147c8464099d05ad48cc922ac)
- getting further into the child ordering test [`365ceab`](https://github.com/ljharb/tape/commit/365ceabb8d6f90917aeab8bedcf0b6ddba355a88)
- update the harness test for createStream [`5329dc6`](https://github.com/ljharb/tape/commit/5329dc626400169e115fe6aec87bea459def6956)
- partial fix for v0.10 exiting early [`78c7b77`](https://github.com/ljharb/tape/commit/78c7b7727bf67a7be4965c00f07c996157133265)
- partly fixed the test name ordering issue [`c4dc7ac`](https://github.com/ljharb/tape/commit/c4dc7aced29b27bba0bcf88b68a33c1edf003acb)

## [v0.3.3](https://github.com/ljharb/tape/compare/v0.3.2...v0.3.3) - 2013-04-01

### Commits

- using testling [`4fe80b3`](https://github.com/ljharb/tape/commit/4fe80b3a31f065240b255998916f1dd98ef160c9)
- use setImmediate on 0.10 [`d5b3bc2`](https://github.com/ljharb/tape/commit/d5b3bc26c9b9c9c5348a183c538a063f31555c6f)
- stub out .map() [`95f1bb4`](https://github.com/ljharb/tape/commit/95f1bb4e3320acfbdb57e4c3818dea3cbe84896f)
- minor fix for 0.10 [`52e25d8`](https://github.com/ljharb/tape/commit/52e25d8f78d00bcaf855ec2916684c9ba15e1caf)
- drop 0.6, add 0.10 in travis [`04253f6`](https://github.com/ljharb/tape/commit/04253f62cd59bb71b81f889ea46f0671323e7725)
- guard process.exit() with a canExit for browsers [`50f03fd`](https://github.com/ljharb/tape/commit/50f03fdcfc6c53f4bc3ef8fa4ae29d5e2941c0ef)

## [v0.3.2](https://github.com/ljharb/tape/compare/v0.3.1...v0.3.2) - 2013-03-25

### Commits

- failing exit test for 2nd test() plans [`e7d00be`](https://github.com/ljharb/tape/commit/e7d00be1662868a5da776e9a093fc857680153aa)
- use a setInterval to keep the event loop alive [`c20c556`](https://github.com/ljharb/tape/commit/c20c556d2199a6ce4605f09ca3405b6ea91cf82e)
- clean up the global harness exit interval [`361ecb6`](https://github.com/ljharb/tape/commit/361ecb6ce4e68bb5366b83045a82eea9cffa894d)
- fix the second exit test asserts [`c85294a`](https://github.com/ljharb/tape/commit/c85294a4a335f3cad4a2e7de9c685fd0fe044b24)

## [v0.3.1](https://github.com/ljharb/tape/compare/v0.3.0...v0.3.1) - 2013-03-21

### Commits

- use json-stringify-safe in render.js to not throw on circular structures [`51a4e66`](https://github.com/ljharb/tape/commit/51a4e66ce27a1edd42a6a00ec1c183536ad496b7)
- implemented decycle for JSON.stringify that should work in IE [`178a8dc`](https://github.com/ljharb/tape/commit/178a8dc329ed57d23222be2f1bdbd440e4618368)

## [v0.3.0](https://github.com/ljharb/tape/compare/v0.2.2...v0.3.0) - 2013-03-11

### Commits

- add small test runner [`80e309a`](https://github.com/ljharb/tape/commit/80e309ad6ae355bddaee54a33a1b69b871cff322)

## [v0.2.2](https://github.com/ljharb/tape/compare/v0.2.1...v0.2.2) - 2013-01-18

### Commits

- fix merge conflicts [`5e53c14`](https://github.com/ljharb/tape/commit/5e53c14c4ee8caec01714f943c7b153478a0002f)
- Do not close renderer twice. [`ad90739`](https://github.com/ljharb/tape/commit/ad90739e9f1d6824ec55c990748f4c61c6d856c6)
- whitespace back [`2666849`](https://github.com/ljharb/tape/commit/266684958a3f8e5ed9ed9436107a5940a2e1bb29)
- fix close bug [`bd1db4e`](https://github.com/ljharb/tape/commit/bd1db4ee2d6129dfad57187ea7ccdc1522178f6b)

## [v0.2.1](https://github.com/ljharb/tape/compare/v0.2.0...v0.2.1) - 2013-01-18

### Commits

- test.only [`8a99091`](https://github.com/ljharb/tape/commit/8a990919f4d869b1ce7251797edd69f37dbdd706)
- undo whitespace [`6e1cd97`](https://github.com/ljharb/tape/commit/6e1cd97536620ae5c657d3feafd9e4055b4641c5)
- bad comma [`f0fd72a`](https://github.com/ljharb/tape/commit/f0fd72a15350b98c2e3786a36c6837628171add4)

## [v0.2.0](https://github.com/ljharb/tape/compare/v0.1.5...v0.2.0) - 2013-01-17

### Commits

- show `at` locations in errors [`35ba8a3`](https://github.com/ljharb/tape/commit/35ba8a36f023361089d1d09c122a8288cb061ede)
- tape drive image [`1786bcc`](https://github.com/ljharb/tape/commit/1786bccafca6abbee091e4b9bf64bf0c1c7bbc17)

## [v0.1.5](https://github.com/ljharb/tape/compare/v0.1.4...v0.1.5) - 2012-12-20

### Commits

- failing max listeners test [`4058f75`](https://github.com/ljharb/tape/commit/4058f754e633d44c226d92a64fcc30aced7db3a3)
- avoid max listeners warnings, test passes [`2f8a822`](https://github.com/ljharb/tape/commit/2f8a822688581fb1c506ab51921aff40429fb45c)

## [v0.1.4](https://github.com/ljharb/tape/compare/v0.1.3...v0.1.4) - 2012-12-20

### Commits

- put back whitespace to annoy @Raynos [`ce84d89`](https://github.com/ljharb/tape/commit/ce84d891e86a20a2bcf8a6bd1f31226d745e0a8c)
- failing order test [`c3b7dda`](https://github.com/ljharb/tape/commit/c3b7ddaf2f58d487673c91a3fb9b24e5510db9ed)
- failing order test [`ea0eff9`](https://github.com/ljharb/tape/commit/ea0eff904121d8be2348e0a9313afeae86f721c4)
- NO MERGE CONFLICT [`9241450`](https://github.com/ljharb/tape/commit/9241450e865b0aed098663f16edec01f96ebae1b)
- Count the number of times `test` is invoked [`e436a61`](https://github.com/ljharb/tape/commit/e436a61cee255579521538bce7f68851f8065e75)
- fixed bug [`c32b131`](https://github.com/ljharb/tape/commit/c32b13155708f8084f585f793a1995ce4a2e598d)
- Synchronous race conditions [`19d7f88`](https://github.com/ljharb/tape/commit/19d7f885bae8bc8e067d4ffcbb6d696acebca3f8)
- dont log [`359a67f`](https://github.com/ljharb/tape/commit/359a67f9a00d101581da2f7b16bb0417f2acbada)

## [v0.1.3](https://github.com/ljharb/tape/compare/v0.1.2...v0.1.3) - 2012-12-19

### Commits

- fix the optional plan test on 0.6 [`af728e8`](https://github.com/ljharb/tape/commit/af728e8b869a011785a9a5d17f514be8e401e34c)
- fix for the exit test on 0.6 [`17d0335`](https://github.com/ljharb/tape/commit/17d03354276fb82cc756cbcf13c82826652f76d5)

## [v0.1.2](https://github.com/ljharb/tape/compare/v0.1.1...v0.1.2) - 2012-12-19

### Commits

- not enough example [`9b2ffe1`](https://github.com/ljharb/tape/commit/9b2ffe1031c1e24ea1990324d6f7ee709d28f8f1)
- only do console.log() mode, fix double \n bug [`028e858`](https://github.com/ljharb/tape/commit/028e858f85c6916a730dca183c00469ebb869729)

## [v0.1.1](https://github.com/ljharb/tape/compare/v0.1.0...v0.1.1) - 2012-12-12

### Fixed

- Handle regexp in throws. Fixes #8 [`#8`](https://github.com/ljharb/tape/issues/8)

## [v0.1.0](https://github.com/ljharb/tape/compare/v0.0.5...v0.1.0) - 2012-12-03

### Commits

- failing exit test [`104af1f`](https://github.com/ljharb/tape/commit/104af1fcad7f92d866cc2ddc7e4f688c854995cb)
- passing exit ok test [`7de897c`](https://github.com/ljharb/tape/commit/7de897c665367a61f7ed6773216e90b1b662e6c3)
- too few assertion test [`4ae9c04`](https://github.com/ljharb/tape/commit/4ae9c049f28f45f5b50104b2dc4694c1b3712f6f)
- feature-detect process.exit() and "exit" events, exit tests now passes [`6fc71ba`](https://github.com/ljharb/tape/commit/6fc71bab2efae31b574a327de23d491345f4f504)
- failing throw test [`3d58fef`](https://github.com/ljharb/tape/commit/3d58fefe2c323e70f9f3442ca127e9ec23065c87)
- throw test passes [`37f79d2`](https://github.com/ljharb/tape/commit/37f79d242b104bfb80b3152a2ee86e105be251a3)
- better error messages with stack traces [`1f1fcf7`](https://github.com/ljharb/tape/commit/1f1fcf76cfe46cf1cc613538d36face17733e89a)
- update tests to thread through exit: false [`c8e11e1`](https://github.com/ljharb/tape/commit/c8e11e1f2c9b537c7fbf5bdf1cb6defaa83f41e3)
- clean up feature detection [`329f784`](https://github.com/ljharb/tape/commit/329f784fbd42de778a09df441ad0a8595650c9c8)
- 0.1.0 now with exit and exception handling [`ba72d57`](https://github.com/ljharb/tape/commit/ba72d5754ec4b6b70e4535d6dc3909352c48eac7)

## [v0.0.5](https://github.com/ljharb/tape/compare/v0.0.4...v0.0.5) - 2012-11-28

### Commits

- fix typo in t.notOk() [`369e7ee`](https://github.com/ljharb/tape/commit/369e7eef5fce3e91b9b21dfe5f915b1505edd82e)

## [v0.0.4](https://github.com/ljharb/tape/compare/v0.0.3...v0.0.4) - 2012-11-26

### Commits

- Return t [`21afbcb`](https://github.com/ljharb/tape/commit/21afbcb522c219ac65a6d2720aa2679b7d925eee)

## [v0.0.3](https://github.com/ljharb/tape/compare/v0.0.2...v0.0.3) - 2012-11-25

### Commits

- using `defined` for defined-or (//) [`6ce0e1a`](https://github.com/ljharb/tape/commit/6ce0e1a926c6f81504cd3d9e72254bf6815e0088)

## [v0.0.2](https://github.com/ljharb/tape/compare/v0.0.1...v0.0.2) - 2012-11-25

### Fixed

- Handle children in order, and grandchildren [`#5`](https://github.com/ljharb/tape/issues/5) [`#6`](https://github.com/ljharb/tape/issues/6)
- Fix #3 Implement Test.comment [`#3`](https://github.com/ljharb/tape/issues/3)

### Commits

- A test for createHarness [`21fe619`](https://github.com/ljharb/tape/commit/21fe61941b05171eda6a4b40f20e918f205e9303)

## [v0.0.1](https://github.com/ljharb/tape/compare/v0.0.0...v0.0.1) - 2012-11-25

### Fixed

- Fix child ordering [`#4`](https://github.com/ljharb/tape/issues/4)
- Use conf object, support skipping entire tests [`#2`](https://github.com/ljharb/tape/issues/2)
- plan() should be optional [`#1`](https://github.com/ljharb/tape/issues/1)

### Commits

- browser example [`6192cb5`](https://github.com/ljharb/tape/commit/6192cb55175d3eecdf619207ea75a4ce70671c61)
- browser compatibility notes [`0557b39`](https://github.com/ljharb/tape/commit/0557b3945d47c6ac5ba7e82762ce564ed0f149b8)
- fix keyword silliness [`e14cce3`](https://github.com/ljharb/tape/commit/e14cce3a3ad8cdb48f40dc3d640e37830968ec59)

## v0.0.0 - 2012-11-25

### Commits

- mostly compatible with node-tap assertions, stubbed out assertion-to-TAP logic [`7948e2e`](https://github.com/ljharb/tape/commit/7948e2ee439135efee86ea0b7ce24c9deea4b018)
- documentation, test.stream [`7e1d1f0`](https://github.com/ljharb/tape/commit/7e1d1f060b018bc81ee924c64f14ee2fda33d853)
- fix double-piping bug in the output [`ddd2535`](https://github.com/ljharb/tape/commit/ddd2535d2e103a8461db808ed7d262b3cd1930d1)
- failing nested test [`422bfb4`](https://github.com/ljharb/tape/commit/422bfb48e97ef3fb99012765760abee16935e6f8)
- passing too many test [`e888fbb`](https://github.com/ljharb/tape/commit/e888fbb72d54c098143324d0bbe5ce16619b3220)
- passing fail test [`5c2dfed`](https://github.com/ljharb/tape/commit/5c2dfed364155240d00d04db56f28431606a9481)
- passing array test [`7991377`](https://github.com/ljharb/tape/commit/79913770856c3470d79e59b5761a2bf15bf78c71)
- package.json etc [`a5b83f2`](https://github.com/ljharb/tape/commit/a5b83f2f10afc363b5086281fa8797e906008413)
- nested failure example [`1ea9057`](https://github.com/ljharb/tape/commit/1ea9057585ae957f0a15d37afdf9872625d1e996)
- basic tap output works [`53ab0e8`](https://github.com/ljharb/tape/commit/53ab0e8dadc2b5a415183633b67b6339b2ecac16)
- nested tests work [`c9ca5be`](https://github.com/ljharb/tape/commit/c9ca5be0de56ee26a40347e2f17496c307ce355d)
- plan errors [`40aafce`](https://github.com/ljharb/tape/commit/40aafce59661cc2f89e9702e0cbb69fd568a1f20)
- expected, actual, and operator keys in yaml-esque format on assertion failures [`dab1314`](https://github.com/ljharb/tape/commit/dab13148eceaaac81c1fbb92004fe7663c839e5b)
- send the end event properly [`46fb0a1`](https://github.com/ljharb/tape/commit/46fb0a1e5b305d07ffaf1c464325356c269fb5fe)
- trailing tap data [`463afd2`](https://github.com/ljharb/tape/commit/463afd287c5833917a96c44f0f4d5a8dea56f67c)
- remove nested test indents to pass the tests [`f6b844e`](https://github.com/ljharb/tape/commit/f6b844ec13e57391e37bd8eb4ab1c58aa7ef98fc)
- initial artistic direction [`da360eb`](https://github.com/ljharb/tape/commit/da360eb938e221a160408f6c49a1a3659981e410)
- using travis [`749e84f`](https://github.com/ljharb/tape/commit/749e84fa5b25f156e8d60bdd81599291c2b029d9)
- document t.test() [`77983ab`](https://github.com/ljharb/tape/commit/77983ab8093d996ed5fc59e624209d989a16c7d3)
- send the tap header [`31dae7d`](https://github.com/ljharb/tape/commit/31dae7d2c50dcba7ddf71e927ee3cb0f49c47046)
