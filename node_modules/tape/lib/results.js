'use strict';

var defined = require('defined');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('through');
var resumer = require('resumer');
var inspect = require('object-inspect');
var callBound = require('call-bind/callBound');
var has = require('has');
var $exec = callBound('RegExp.prototype.exec');
var yamlIndicators = /:|-|\?/;
var nextTick = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;

function coalesceWhiteSpaces(str) {
	return String(str).replace(/\s+/g, ' ');
}

function invalidYaml(str) {
	return $exec(yamlIndicators, str) !== null;
}

function encodeResult(res, count) {
	var output = '';
	output += (res.ok ? 'ok ' : 'not ok ') + count;
	output += res.name ? ' ' + coalesceWhiteSpaces(res.name) : '';

	if (res.skip) {
		output += ' # SKIP' + (typeof res.skip === 'string' ? ' ' + coalesceWhiteSpaces(res.skip) : '');
	} else if (res.todo) {
		output += ' # TODO' + (typeof res.todo === 'string' ? ' ' + coalesceWhiteSpaces(res.todo) : '');
	}

	output += '\n';
	if (res.ok) { return output; }

	var outer = '  ';
	var inner = outer + '  ';
	output += outer + '---\n';
	output += inner + 'operator: ' + res.operator + '\n';

	if (has(res, 'expected') || has(res, 'actual')) {
		var ex = inspect(res.expected, { depth: res.objectPrintDepth });
		var ac = inspect(res.actual, { depth: res.objectPrintDepth });

		if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
			output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
			output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
		} else {
			output += inner + 'expected: ' + ex + '\n';
			output += inner + 'actual:   ' + ac + '\n';
		}
	}
	if (res.at) {
		output += inner + 'at: ' + res.at + '\n';
	}

	var actualStack = res.actual && (typeof res.actual === 'object' || typeof res.actual === 'function') ? res.actual.stack : undefined;
	var errorStack = res.error && res.error.stack;
	var stack = defined(actualStack, errorStack);
	if (stack) {
		var lines = String(stack).split('\n');
		output += inner + 'stack: |-\n';
		for (var i = 0; i < lines.length; i++) {
			output += inner + '  ' + lines[i] + '\n';
		}
	}

	output += outer + '...\n';
	return output;
}

function getNextTest(results) {
	if (!results._only) {
		return results.tests.shift();
	}

	do {
		var t = results.tests.shift();
		if (t && results._only === t) {
			return t;
		}
	} while (results.tests.length !== 0);

	return void undefined;
}

function Results() {
	if (!(this instanceof Results)) { return new Results(); }
	this.count = 0;
	this.fail = 0;
	this.pass = 0;
	this.todo = 0;
	this._stream = through();
	this.tests = [];
	this._only = null;
	this._isRunning = false;
}

inherits(Results, EventEmitter);

Results.prototype.createStream = function (opts) {
	if (!opts) { opts = {}; }
	var self = this;
	var output;
	var testId = 0;
	if (opts.objectMode) {
		output = through();
		self.on('_push', function ontest(t, extra) {
			if (!extra) { extra = {}; }
			var id = testId++;
			t.once('prerun', function () {
				var row = {
					type: 'test',
					name: t.name,
					id: id,
					skip: t._skip,
					todo: t._todo
				};
				if (has(extra, 'parent')) {
					row.parent = extra.parent;
				}
				output.queue(row);
			});
			t.on('test', function (st) {
				ontest(st, { parent: id });
			});
			t.on('result', function (res) {
				if (res && typeof res === 'object') {
					res.test = id;
					res.type = 'assert';
				}
				output.queue(res);
			});
			t.on('end', function () {
				output.queue({ type: 'end', test: id });
			});
		});
		self.on('done', function () { output.queue(null); });
	} else {
		output = resumer();
		output.queue('TAP version 13\n');
		self._stream.pipe(output);
	}

	if (!this._isRunning) {
		this._isRunning = true;
		nextTick(function next() {
			var t;
			while (t = getNextTest(self)) {
				t.run();
				if (!t.ended) {
					t.once('end', function () { nextTick(next); });
					return;
				}
			}
			self.emit('done');
		});
	}

	return output;
};

Results.prototype.push = function (t) {
	var self = this;
	self.tests.push(t);
	self._watch(t);
	self.emit('_push', t);
};

Results.prototype.only = function (t) {
	this._only = t;
};

Results.prototype._watch = function (t) {
	var self = this;
	function write(s) { self._stream.queue(s); }
	t.once('prerun', function () {
		var premsg = '';
		if (t._skip) {
			premsg = 'SKIP ';
		} else if (t._todo) {
			premsg = 'TODO ';
		}
		write('# ' + premsg + coalesceWhiteSpaces(t.name) + '\n');
	});

	t.on('result', function (res) {
		if (typeof res === 'string') {
			write('# ' + res + '\n');
			return;
		}
		write(encodeResult(res, self.count + 1));
		self.count++;

		if (res.ok || res.todo) {
			self.pass++;
		} else {
			self.fail++;
			self.emit('fail');
		}
	});

	t.on('test', function (st) { self._watch(st); });
};

Results.prototype.close = function () {
	var self = this;
	if (self.closed) { self._stream.emit('error', new Error('ALREADY CLOSED')); }
	self.closed = true;
	function write(s) { self._stream.queue(s); }

	write('\n1..' + self.count + '\n');
	write('# tests ' + self.count + '\n');
	write('# pass  ' + (self.pass + self.todo) + '\n');
	if (self.todo) {
		write('# todo  ' + self.todo + '\n');
	} if (self.fail) {
		write('# fail  ' + self.fail + '\n');
	} else {
		write('\n# ok\n');
	}

	self._stream.queue(null);
};

module.exports = Results;
