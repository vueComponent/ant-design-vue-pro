# tape <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

tap-producing test harness for node and browsers

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

![tape](https://web.archive.org/web/20170612184731if_/http://substack.net/images/tape_drive.png)

# example

``` js
var test = require('tape');

test('timing test', function (t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});
```

```
$ node example/timing.js
TAP version 13
# timing test
ok 1 should be equal
not ok 2 should be equal
  ---
    operator: equal
    expected: 100
    actual:   107
  ...

1..2
# tests 2
# pass  1
# fail  1
```

# usage

You always need to `require('tape')` in test files.
You can run the tests by usual node means (`require('test-file.js')` or `node test-file.js`).
You can also run tests using the `tape` binary to utilize globbing, on Windows for example:

```sh
$ tape tests/**/*.js
```

`tape`'s arguments are passed to the [`glob`](https://www.npmjs.com/package/glob) module.
If you want `glob` to perform the expansion on a system where the shell performs such expansion, quote the arguments as necessary:

```sh
$ tape 'tests/**/*.js'
$ tape "tests/**/*.js"
```

## Preloading modules

Additionally, it is possible to make `tape` load one or more modules before running any tests, by using the `-r` or `--require` flag. Here's an example that loads [babel-register](http://babeljs.io/docs/usage/require/) before running any tests, to allow for JIT compilation:

```sh
$ tape -r babel-register tests/**/*.js
```

Depending on the module you're loading, you may be able to parameterize it using environment variables or auxiliary files. Babel, for instance, will load options from [`.babelrc`](http://babeljs.io/docs/usage/babelrc/) at runtime.

The `-r` flag behaves exactly like node's `require`, and uses the same module resolution algorithm. This means that if you need to load local modules, you have to prepend their path with `./` or `../` accordingly.

For example:

```sh
$ tape -r ./my/local/module tests/**/*.js
```

Please note that all modules loaded using the `-r` flag will run *before* any tests, regardless of when they are specified. For example, `tape -r a b -r c` will actually load `a` and `c` *before* loading `b`, since they are flagged as required modules.

# things that go well with tape

`tape` maintains a fairly minimal core. Additional features are usually added by using another module alongside `tape`.

## pretty reporters

The default TAP output is good for machines and humans that are robots.

If you want a more colorful / pretty output there are lots of modules on npm that will output something pretty if you pipe TAP into them:

- [tap-spec](https://github.com/scottcorgan/tap-spec)
- [tap-dot](https://github.com/scottcorgan/tap-dot)
- [faucet](https://github.com/ljharb/faucet)
- [tap-bail](https://github.com/juliangruber/tap-bail)
- [tap-browser-color](https://github.com/kirbysayshi/tap-browser-color)
- [tap-json](https://github.com/gummesson/tap-json)
- [tap-min](https://github.com/derhuerst/tap-min)
- [tap-nyan](https://github.com/calvinmetcalf/tap-nyan)
- [tap-pessimist](https://www.npmjs.org/package/tap-pessimist)
- [tap-prettify](https://github.com/toolness/tap-prettify)
- [colortape](https://github.com/shuhei/colortape)
- [tap-xunit](https://github.com/aghassemi/tap-xunit)
- [tap-difflet](https://github.com/namuol/tap-difflet)
- [tape-dom](https://github.com/gritzko/tape-dom)
- [tap-diff](https://github.com/axross/tap-diff)
- [tap-notify](https://github.com/axross/tap-notify)
- [tap-summary](https://github.com/zoubin/tap-summary)
- [tap-markdown](https://github.com/Hypercubed/tap-markdown)
- [tap-html](https://github.com/gabrielcsapo/tap-html)
- [tap-react-browser](https://github.com/mcnuttandrew/tap-react-browser)
- [tap-junit](https://github.com/dhershman1/tap-junit)
- [tap-nyc](https://github.com/MegaArman/tap-nyc)
- [tap-spec (emoji patch)](https://github.com/Sceat/tap-spec-emoji)
- [tape-repeater](https://github.com/rgruesbeck/tape-repeater)
- [tabe](https://github.com/Josenzo/tabe)

To use them, try `node test/index.js | tap-spec` or pipe it into one of the modules of your choice!

## uncaught exceptions

By default, uncaught exceptions in your tests will not be intercepted, and will cause `tape` to crash. If you find this behavior undesirable, use [`tape-catch`](https://github.com/michaelrhodes/tape-catch) to report any exceptions as TAP errors.

## other

- CoffeeScript support with https://www.npmjs.com/package/coffeetape
- Promise support with https://www.npmjs.com/package/blue-tape or https://www.npmjs.com/package/tape-promise
- ES6 support with https://www.npmjs.com/package/babel-tape-runner or https://www.npmjs.com/package/buble-tape-runner
- Different test syntax with https://github.com/pguth/flip-tape (warning: mutates String.prototype)
- Electron test runner with https://github.com/tundrax/electron-tap
- Concurrency support with https://github.com/imsnif/mixed-tape
- In-process reporting with https://github.com/DavidAnson/tape-player
- Describe blocks with https://github.com/mattriley/tape-describe

# command-line flags

While running tests, top-level configurations can be passed via the command line to specify desired behavior.

Available configurations are listed below:

## --require

**Alias**: `-r`

This is used to load modules before running tests and is explained extensively in the [preloading modules](#preloading-modules) section.

## --ignore

**Alias**: `-i`

This flag is used when tests from certain folders and/or files are not intended to be run. It defaults to `.gitignore` file when passed with no argument.

```sh
tape -i .ignore **/*.js
```

An error is thrown if the specified file passed as argument does not exist.

## --no-only
This is particularly useful in a CI environment where an [only test](#testonlyname-opts-cb) is not supposed to go unnoticed.

By passing the `--no-only` flag, any existing [only test](#testonlyname-opts-cb) causes tests to fail.

```sh
tape --no-only **/*.js
```

Alternatively, the environment variable `NODE_TAPE_NO_ONLY_TEST` can be set to `true` to achieve the same behavior; the command-line flag takes precedence.

# methods

The assertion methods in `tape` are heavily influenced or copied from the methods in [node-tap](https://github.com/isaacs/node-tap).

```js
var test = require('tape')
```

## test([name], [opts], cb)

Create a new test with an optional `name` string and optional `opts` object.
`cb(t)` fires with the new test object `t` once all preceding tests have finished.
Tests execute serially.

Available `opts` options are:
- opts.skip = true/false. See test.skip.
- opts.timeout = 500. Set a timeout for the test, after which it will fail. See test.timeoutAfter.
- opts.objectPrintDepth = 5. Configure max depth of expected / actual object printing. Environmental variable `NODE_TAPE_OBJECT_PRINT_DEPTH` can set the desired default depth for all tests; locally-set values will take precedence.
- opts.todo = true/false. Test will be allowed to fail.

If you forget to `t.plan()` out how many assertions you are going to run and you don't call `t.end()` explicitly, your test will hang.

## test.skip([name], [opts], cb)

Generate a new test that will be skipped over.

## test.onFinish(fn)

The onFinish hook will get invoked when ALL `tape` tests have finished right before `tape` is about to print the test summary.

`fn` is called with no arguments, and its return value is ignored.

## test.onFailure(fn)

The onFailure hook will get invoked whenever any `tape` tests has failed.

`fn` is called with no arguments, and its return value is ignored.

## t.plan(n)

Declare that `n` assertions should be run. `t.end()` will be called automatically after the `n`th assertion.
If there are any more assertions after the `n`th, or after `t.end()` is called, they will generate errors.

## t.end(err)

Declare the end of a test explicitly. If `err` is passed in `t.end` will assert that it is falsy.

Do not call `t.end()` if your test callback returns a Promise.

## t.teardown(cb)

Register a callback to run after the individual test has completed. Multiple registered teardown callbacks will run in order. Useful for undoing side effects, closing network connections, etc.

## t.fail(msg)

Generate a failing assertion with a message `msg`.

## t.pass(msg)

Generate a passing assertion with a message `msg`.

## t.timeoutAfter(ms)

Automatically timeout the test after X ms.

## t.skip(msg)

Generate an assertion that will be skipped over.

## t.ok(value, msg)

Assert that `value` is truthy with an optional description of the assertion `msg`.

Aliases: `t.true()`, `t.assert()`

## t.notOk(value, msg)

Assert that `value` is falsy with an optional description of the assertion `msg`.

Aliases: `t.false()`, `t.notok()`

## t.error(err, msg)

Assert that `err` is falsy. If `err` is non-falsy, use its `err.message` as the description message.

Aliases: `t.ifError()`, `t.ifErr()`, `t.iferror()`

## t.equal(actual, expected, msg)

Assert that `actual === expected` with an optional description of the assertion `msg`.

Aliases: `t.equals()`, `t.isEqual()`, `t.is()`, `t.strictEqual()`,
`t.strictEquals()`

## t.notEqual(actual, expected, msg)

Assert that `actual !== expected` with an optional description of the assertion `msg`.

Aliases: `t.notEquals()`, `t.notStrictEqual()`, `t.notStrictEquals()`,
`t.isNotEqual()`, `t.isNot()`, `t.not()`, `t.doesNotEqual()`, `t.isInequal()`

## t.deepEqual(actual, expected, msg)

Assert that `actual` and `expected` have the same structure and nested values using [node's deepEqual() algorithm](https://github.com/inspect-js/node-deep-equal) with strict comparisons (`===`) on leaf nodes and an optional description of the assertion `msg`.

Aliases: `t.deepEquals()`, `t.isEquivalent()`, `t.same()`

## t.notDeepEqual(actual, expected, msg)

Assert that `actual` and `expected` do not have the same structure and nested values using [node's deepEqual() algorithm](https://github.com/inspect-js/node-deep-equal) with strict comparisons (`===`) on leaf nodes and an optional description of the assertion `msg`.

Aliases: `t.notDeepEquals`, `t.notEquivalent()`, `t.notDeeply()`, `t.notSame()`,
`t.isNotDeepEqual()`, `t.isNotDeeply()`, `t.isNotEquivalent()`,
`t.isInequivalent()`

## t.deepLooseEqual(actual, expected, msg)

Assert that `actual` and `expected` have the same structure and nested values using [node's deepEqual() algorithm](https://github.com/inspect-js/node-deep-equal) with loose comparisons (`==`) on leaf nodes and an optional description of the assertion `msg`.

Aliases: `t.looseEqual()`, `t.looseEquals()`

## t.notDeepLooseEqual(actual, expected, msg)

Assert that `actual` and `expected` do not have the same structure and nested values using [node's deepEqual() algorithm](https://github.com/inspect-js/node-deep-equal) with loose comparisons (`==`) on leaf nodes and an optional description of the assertion `msg`.

Aliases: `t.notLooseEqual()`, `t.notLooseEquals()`

## t.throws(fn, expected, msg)

Assert that the function call `fn()` throws an exception. `expected`, if present, must be a `RegExp`, `Function`, or `Object`. The `RegExp` matches the string representation of the exception, as generated by `err.toString()`. For example, if you set `expected` to `/user/`, the test will pass only if the string representation of the exception contains the word `user`. Any other exception will result in a failed test. The `Function` is the exception thrown (e.g. `Error`). `Object` in this case corresponds to a so-called validation object, in which each property is tested for strict deep equality. As an example, see the following two tests--each passes a validation object to `t.throws()` as the second parameter. The first test will pass, because all property values in the actual error object are deeply strictly equal to the property values in the validation object.
```
    const err = new TypeError("Wrong value");
    err.code = 404;
    err.check = true;

    // Passing test.
    t.throws(
        () => {
            throw err;
        },
        {
            code: 404,
            check: true
        },
        "Test message."
    );
```
This next test will fail, because all property values in the actual error object are _not_ deeply strictly equal to the property values in the validation object.
```
    const err = new TypeError("Wrong value");
    err.code = 404;
    err.check = "true";

    // Failing test.
    t.throws(
        () => {
            throw err;
        },
        {
            code: 404,
            check: true // This is not deeply strictly equal to err.check.
        },
        "Test message."
    );
```

This is very similar to how Node's `assert.throws()` method tests validation objects (please see the [Node _assert.throws()_ documentation](https://nodejs.org/api/assert.html#assert_assert_throws_fn_error_message) for more information).

If `expected` is not of type `RegExp`, `Function`, or `Object`, or omitted entirely, any exception will result in a passed test. `msg` is an optional description of the assertion.

Please note that the second parameter, `expected`, cannot be of type `string`. If a value of type `string` is provided for `expected`, then `t.throws(fn, expected, msg)`  will execute, but the value of `expected` will be set to  `undefined`, and the specified string will be set as the value for the `msg` parameter (regardless of what _actually_ passed as the third parameter). This can cause unexpected results, so please be mindful.

## t.doesNotThrow(fn, expected, msg)

Assert that the function call `fn()` does not throw an exception. `expected`, if present, limits what should not be thrown, and must be a `RegExp` or `Function`. The `RegExp` matches the string representation of the exception, as generated by `err.toString()`. For example, if you set `expected` to `/user/`, the test will fail  only if the string representation of the exception contains the word `user`. Any other exception will result in a passed test.  The `Function` is the exception thrown (e.g. `Error`).  If `expected` is not of type `RegExp` or `Function`, or omitted entirely, any exception will result in a failed test. `msg` is an optional description of the assertion.

Please note that the second parameter, `expected`, cannot be of type `string`. If a value of type `string` is provided for `expected`, then `t.doesNotThrows(fn, expected, msg)`  will execute, but the value of `expected` will be set to  `undefined`, and the specified string will be set as the value for the `msg` parameter (regardless of what _actually_ passed as the third parameter). This can cause unexpected results, so please be mindful.

## t.test(name, [opts], cb)

Create a subtest with a new test handle `st` from `cb(st)` inside the current test `t`. `cb(st)` will only fire when `t` finishes. Additional tests queued up after `t` will not be run until all subtests finish.

You may pass the same options that [`test()`](#testname-opts-cb) accepts.

## t.comment(message)

Print a message without breaking the tap output. (Useful when using e.g. `tap-colorize` where output is buffered & `console.log` will print in incorrect order vis-a-vis tap output.)

Multiline output will be split by `\n` characters, and each one printed as a comment.

## t.match(string, regexp, message)

Assert that `string` matches the RegExp `regexp`. Will fail when the first two arguments are the wrong type.

## t.doesNotMatch(string, regexp, message)

Assert that `string` does not match the RegExp `regexp`. Will fail when the first two arguments are the wrong type.

## var htest = test.createHarness()

Create a new test harness instance, which is a function like `test()`, but with a new pending stack and test state.

By default the TAP output goes to `console.log()`. You can pipe the output to someplace else if you `htest.createStream().pipe()` to a destination stream on the first tick.

## test.only([name], [opts], cb)

Like `test([name], [opts], cb)` except if you use `.only` this is the only test case that will run for the entire process, all other test cases using `tape` will be ignored.

Check out how the usage of [the --no-only flag](#--no-only) could help ensure there is no `.only` test running in a specified environment.

## var stream = test.createStream(opts)

Create a stream of output, bypassing the default output stream that writes messages to `console.log()`. By default `stream` will be a text stream of TAP output, but you can get an object stream instead by setting `opts.objectMode` to `true`.

### tap stream reporter

You can create your own custom test reporter using this `createStream()` api:

``` js
var test = require('tape');
var path = require('path');

test.createStream().pipe(process.stdout);

process.argv.slice(2).forEach(function (file) {
    require(path.resolve(file));
});
```

You could substitute `process.stdout` for whatever other output stream you want, like a network connection or a file.

Pass in test files to run as arguments:

```sh
$ node tap.js test/x.js test/y.js
TAP version 13
# (anonymous)
not ok 1 should be equal
  ---
    operator: equal
    expected: "boop"
    actual:   "beep"
  ...
# (anonymous)
ok 2 should be equal
ok 3 (unnamed assert)
# wheee
ok 4 (unnamed assert)

1..4
# tests 4
# pass  3
# fail  1
```

### object stream reporter

Here's how you can render an object stream instead of TAP:

``` js
var test = require('tape');
var path = require('path');

test.createStream({ objectMode: true }).on('data', function (row) {
    console.log(JSON.stringify(row))
});

process.argv.slice(2).forEach(function (file) {
    require(path.resolve(file));
});
```

The output for this runner is:

```sh
$ node object.js test/x.js test/y.js
{"type":"test","name":"(anonymous)","id":0}
{"id":0,"ok":false,"name":"should be equal","operator":"equal","actual":"beep","expected":"boop","error":{},"test":0,"type":"assert"}
{"type":"end","test":0}
{"type":"test","name":"(anonymous)","id":1}
{"id":0,"ok":true,"name":"should be equal","operator":"equal","actual":2,"expected":2,"test":1,"type":"assert"}
{"id":1,"ok":true,"name":"(unnamed assert)","operator":"ok","actual":true,"expected":true,"test":1,"type":"assert"}
{"type":"end","test":1}
{"type":"test","name":"wheee","id":2}
{"id":0,"ok":true,"name":"(unnamed assert)","operator":"ok","actual":true,"expected":true,"test":2,"type":"assert"}
{"type":"end","test":2}
```

A convenient alternative to achieve the same:
```js
// report.js
var test = require('tape');

test.createStream({ objectMode: true }).on('data', function (row) {
    console.log(JSON.stringify(row)) // for example
});
```
and then:
```sh
$ tape -r ./report.js **/*.test.js
```

# install

With [npm](https://npmjs.org) do:

```sh
npm install tape --save-dev
```

# troubleshooting

Sometimes `t.end()` doesn’t preserve the expected output ordering.

For instance the following:

```js
var test = require('tape');

test('first', function (t) {

  setTimeout(function () {
    t.ok(1, 'first test');
    t.end();
  }, 200);

  t.test('second', function (t) {
    t.ok(1, 'second test');
    t.end();
  });
});

test('third', function (t) {
  setTimeout(function () {
    t.ok(1, 'third test');
    t.end();
  }, 100);
});
```

will output:

```
ok 1 second test
ok 2 third test
ok 3 first test
```

because `second` and `third` assume `first` has ended before it actually does.

Use `t.plan()` instead to let other tests know they should wait:

```diff
var test = require('tape');

test('first', function (t) {

+  t.plan(2);

  setTimeout(function () {
    t.ok(1, 'first test');
-    t.end();
  }, 200);

  t.test('second', function (t) {
    t.ok(1, 'second test');
    t.end();
  });
});

test('third', function (t) {
  setTimeout(function () {
    t.ok(1, 'third test');
    t.end();
  }, 100);
});
```

# license

MIT

[package-url]: https://npmjs.org/package/tape
[npm-version-svg]: https://versionbadg.es/ljharb/tape.svg
[deps-svg]: https://david-dm.org/ljharb/tape.svg
[deps-url]: https://david-dm.org/ljharb/tape
[dev-deps-svg]: https://david-dm.org/ljharb/tape/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/tape#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/tape.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/tape.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/tape.svg
[downloads-url]: https://npm-stat.com/charts.html?package=tape
[codecov-image]: https://codecov.io/gh/ljharb/tape/branch/master/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/tape/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/tape
[actions-url]: https://github.com/ljharb/tape/actions
