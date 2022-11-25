'use strict';

var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var has = require('has');
var isRegExp = require('is-regex');
var trim = require('string.prototype.trim');
var callBound = require('call-bind/callBound');
var forEach = require('for-each');
var inspect = require('object-inspect');
var isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var toLowerCase = callBound('String.prototype.toLowerCase');
var $exec = callBound('RegExp.prototype.exec');
var objectToString = callBound('Object.prototype.toString');

var nextTick = typeof setImmediate !== 'undefined'
	? setImmediate
	: process.nextTick;
var safeSetTimeout = setTimeout;
var safeClearTimeout = clearTimeout;

// eslint-disable-next-line no-unused-vars
function getTestArgs(name_, opts_, cb_) {
	var name = '(anonymous)';
	var opts = {};
	var cb;

	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		var t = typeof arg;
		if (t === 'string') {
			name = arg;
		} else if (t === 'object') {
			opts = arg || opts;
		} else if (t === 'function') {
			cb = arg;
		}
	}
	return {
		name: name,
		opts: opts,
		cb: cb
	};
}

function Test(name_, opts_, cb_) {
	if (!(this instanceof Test)) {
		return new Test(name_, opts_, cb_);
	}

	var args = getTestArgs(name_, opts_, cb_);

	this.readable = true;
	this.name = args.name || '(anonymous)';
	this.assertCount = 0;
	this.pendingCount = 0;
	this._skip = args.opts.skip || false;
	this._todo = args.opts.todo || false;
	this._timeout = args.opts.timeout;
	this._plan = undefined;
	this._cb = args.cb;
	this._progeny = [];
	this._teardown = [];
	this._ok = true;
	var depthEnvVar = process.env.NODE_TAPE_OBJECT_PRINT_DEPTH;
	if (args.opts.objectPrintDepth) {
		this._objectPrintDepth = args.opts.objectPrintDepth;
	} else if (depthEnvVar) {
		if (toLowerCase(depthEnvVar) === 'infinity') {
			this._objectPrintDepth = Infinity;
		} else {
			this._objectPrintDepth = depthEnvVar;
		}
	} else {
		this._objectPrintDepth = 5;
	}

	for (var prop in this) {
		this[prop] = (function bind(self, val) {
			if (typeof val === 'function') {
				return function bound() {
					return val.apply(self, arguments);
				};
			}
			return val;
		}(this, this[prop]));
	}
}

inherits(Test, EventEmitter);

Test.prototype.run = function run() {
	this.emit('prerun');
	if (!this._cb || this._skip) {
		this._end();
		return;
	}
	if (this._timeout != null) {
		this.timeoutAfter(this._timeout);
	}
	this._cb(this);
	this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
	var self = this;
	var t = new Test(name, opts, cb);
	this._progeny.push(t);
	this.pendingCount++;
	this.emit('test', t);
	t.on('prerun', function () {
		self.assertCount++;
	});

	if (!self._pendingAsserts()) {
		nextTick(function () {
			self._end();
		});
	}

	nextTick(function () {
		if (!self._plan && self.pendingCount == self._progeny.length) {
			self._end();
		}
	});
};

Test.prototype.comment = function (msg) {
	var that = this;
	forEach(trim(msg).split('\n'), function (aMsg) {
		that.emit('result', trim(aMsg).replace(/^#\s*/, ''));
	});
};

Test.prototype.plan = function (n) {
	this._plan = n;
	this.emit('plan', n);
};

Test.prototype.timeoutAfter = function (ms) {
	if (!ms) { throw new Error('timeoutAfter requires a timespan'); }
	var self = this;
	var timeout = safeSetTimeout(function () {
		self.fail(self.name + ' timed out after ' + ms + 'ms');
		self.end();
	}, ms);
	this.once('end', function () {
		safeClearTimeout(timeout);
	});
};

Test.prototype.end = function end(err) {
	if (arguments.length >= 1 && !!err) {
		this.ifError(err);
	}

	if (this.calledEnd) {
		this.fail('.end() already called');
	}
	this.calledEnd = true;
	this._end();
};

Test.prototype.teardown = function (fn) {
	if (typeof fn !== 'function') {
		this.fail('teardown: ' + inspect(fn) + ' is not a function');
	} else {
		this._teardown.push(fn);
	}
};

Test.prototype._end = function (err) {
	var self = this;
	if (this._progeny.length) {
		var t = this._progeny.shift();
		t.on('end', function () { self._end(); });
		t.run();
		return;
	}

	function completeEnd() {
		if (!self.ended) { self.emit('end'); }
		var pendingAsserts = self._pendingAsserts();
		if (!self._planError && self._plan !== undefined && pendingAsserts) {
			self._planError = true;
			self.fail('plan != count', {
				expected: self._plan,
				actual: self.assertCount
			});
		}
		self.ended = true;
	}

	function next(i) {
		if (i === self._teardown.length) {
			completeEnd();
			return;
		}
		var fn = self._teardown[i];
		var res;
		try {
			res = fn();
		} catch (e) {
			self.fail(e);
		}
		if (res && typeof res.then === 'function') {
			res.then(function () {
				next(++i);
			}, function (_err) {
				err = err || _err;
			});
		} else {
			next(++i);
		}
	}

	if (this._teardown.length > 0) {
		next(0);
	} else {
		completeEnd();
	}
};

Test.prototype._exit = function () {
	if (this._plan !== undefined && !this._planError && this.assertCount !== this._plan) {
		this._planError = true;
		this.fail('plan != count', {
			expected: this._plan,
			actual: this.assertCount,
			exiting: true
		});
	} else if (!this.ended) {
		this.fail('test exited without ending: ' + this.name, {
			exiting: true
		});
	}
};

Test.prototype._pendingAsserts = function () {
	if (this._plan === undefined) {
		return 1;
	}
	return this._plan - (this._progeny.length + this.assertCount);
};

Test.prototype._assert = function assert(ok, opts) {
	var self = this;
	var extra = opts.extra || {};

	ok = !!ok || !!extra.skip;

	var res = {
		id: self.assertCount++,
		ok: ok,
		skip: defined(extra.skip, opts.skip),
		todo: defined(extra.todo, opts.todo, self._todo),
		name: defined(extra.message, opts.message, '(unnamed assert)'),
		operator: defined(extra.operator, opts.operator),
		objectPrintDepth: self._objectPrintDepth
	};
	if (has(opts, 'actual') || has(extra, 'actual')) {
		res.actual = defined(extra.actual, opts.actual);
	}
	if (has(opts, 'expected') || has(extra, 'expected')) {
		res.expected = defined(extra.expected, opts.expected);
	}
	this._ok = !!(this._ok && ok);

	if (!ok && !res.todo) {
		res.error = defined(extra.error, opts.error, new Error(res.name));
	}

	if (!ok) {
		var e = new Error('exception');
		var err = (e.stack || '').split('\n');
		var dir = __dirname + path.sep;

		for (var i = 0; i < err.length; i++) {
			/*
                Stack trace lines may resemble one of the following. We need
                to correctly extract a function name (if any) and path / line
                number for each line.

                    at myFunction (/path/to/file.js:123:45)
                    at myFunction (/path/to/file.other-ext:123:45)
                    at myFunction (/path to/file.js:123:45)
                    at myFunction (C:\path\to\file.js:123:45)
                    at myFunction (/path/to/file.js:123)
                    at Test.<anonymous> (/path/to/file.js:123:45)
                    at Test.bound [as run] (/path/to/file.js:123:45)
                    at /path/to/file.js:123:45

                Regex has three parts. First is non-capturing group for 'at '
                (plus anything preceding it).

                    /^(?:[^\s]*\s*\bat\s+)/

                Second captures function call description (optional). This is
                not necessarily a valid JS function name, but just what the
                stack trace is using to represent a function call. It may look
                like `<anonymous>` or 'Test.bound [as run]'.

                For our purposes, we assume that, if there is a function
                name, it's everything leading up to the first open
                parentheses (trimmed) before our pathname.

                    /(?:(.*)\s+\()?/

                Last part captures file path plus line no (and optional
                column no).

                    /((?:\/|[a-zA-Z]:\\)[^:\)]+:(\d+)(?::(\d+))?)\)?/
            */
			var re = /^(?:[^\s]*\s*\bat\s+)(?:(.*)\s+\()?((?:\/|[a-zA-Z]:\\)[^:)]+:(\d+)(?::(\d+))?)\)?$/;
			var lineWithTokens = err[i].replace(process.cwd(), '/$CWD').replace(__dirname, '/$TEST');
			var m = re.exec(lineWithTokens);

			if (!m) {
				continue;
			}

			var callDescription = m[1] || '<anonymous>';
			var filePath = m[2].replace('/$CWD', process.cwd()).replace('/$TEST', __dirname);

			if (filePath.slice(0, dir.length) === dir) {
				continue;
			}

			// Function call description may not (just) be a function name. Try to extract function name by looking at first "word" only.
			res.functionName = callDescription.split(/\s+/)[0];
			res.file = filePath;
			res.line = Number(m[3]);
			if (m[4]) { res.column = Number(m[4]); }

			res.at = callDescription + ' (' + filePath + ')';
			break;
		}
	}

	self.emit('result', res);

	var pendingAsserts = self._pendingAsserts();
	if (!pendingAsserts) {
		if (extra.exiting) {
			self._end();
		} else {
			nextTick(function () {
				self._end();
			});
		}
	}

	if (!self._planError && pendingAsserts < 0) {
		self._planError = true;
		self.fail('plan != count', {
			expected: self._plan,
			actual: self._plan - pendingAsserts
		});
	}
};

Test.prototype.fail = function (msg, extra) {
	this._assert(false, {
		message: msg,
		operator: 'fail',
		extra: extra
	});
};

Test.prototype.pass = function (msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'pass',
		extra: extra
	});
};

Test.prototype.skip = function (msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'skip',
		skip: true,
		extra: extra
	});
};

// eslint-disable-next-line func-style
var tapeAssert = function assert(value, msg, extra) {
	this._assert(value, {
		message: defined(msg, 'should be truthy'),
		operator: 'ok',
		expected: true,
		actual: value,
		extra: extra
	});
};
Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= tapeAssert;

function notOK(value, msg, extra) {
	this._assert(!value, {
		message: defined(msg, 'should be falsy'),
		operator: 'notOk',
		expected: false,
		actual: value,
		extra: extra
	});
}
Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= notOK;

function error(err, msg, extra) {
	this._assert(!err, {
		message: defined(msg, String(err)),
		operator: 'error',
		actual: err,
		extra: extra
	});
}
Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= error;

function equal(a, b, msg, extra) {
	this._assert(a === b, {
		message: defined(msg, 'should be equal'),
		operator: 'equal',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= equal;

function notEqual(a, b, msg, extra) {
	this._assert(a !== b, {
		message: defined(msg, 'should not be equal'),
		operator: 'notEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= notEqual;

function tapeDeepEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= tapeDeepEqual;

function deepLooseEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= deepLooseEqual;

function notDeepEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should not be equivalent'),
		operator: 'notDeepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepEqual
= Test.prototype.notDeepEquals
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= notDeepEqual;

function notDeepLooseEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'notDeepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= notDeepLooseEqual;

Test.prototype['throws'] = function (fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}

	var caught;

	try {
		fn();
	} catch (err) {
		caught = { error: err };
		if (Object(err) === err && (!isEnumerable(err, 'message') || !has(err, 'message'))) {
			var message = err.message;
			delete err.message;
			err.message = message;
		}
	}

	var passed = caught;

	if (isRegExp(expected)) {
		passed = $exec(expected, caught && caught.error) !== null;
		expected = String(expected);
	}

	if (typeof expected === 'function' && caught) {
		passed = caught.error instanceof expected;
	}

	this._assert(typeof fn === 'function' && passed, {
		message: defined(msg, 'should throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: !passed && caught && caught.error,
		extra: extra
	});
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}
	var caught;
	try {
		fn();
	} catch (err) {
		caught = { error: err };
	}
	this._assert(!caught, {
		message: defined(msg, 'should not throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: caught && caught.error,
		extra: extra
	});
};

Test.prototype.match = function match(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'match',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'match',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'matched' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(matches, {
			message: message,
			operator: 'match',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

Test.prototype.doesNotMatch = function doesNotMatch(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'doesNotMatch',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'doesNotMatch',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'was expected to not match' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(!matches, {
			message: message,
			operator: 'doesNotMatch',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

// eslint-disable-next-line no-unused-vars
Test.skip = function (name_, _opts, _cb) {
	var args = getTestArgs.apply(null, arguments);
	args.opts.skip = true;
	return new Test(args.name, args.opts, args.cb);
};

module.exports = Test;

// vim: set softtabstop=4 shiftwidth=4:
