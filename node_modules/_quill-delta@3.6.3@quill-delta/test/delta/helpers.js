var Delta = require('../../lib/delta');


describe('helpers', function () {
  describe('concat()', function () {
    it('empty delta', function () {
      var delta = new Delta().insert('Test');
      var concat = new Delta();
      var expected = new Delta().insert('Test');
      expect(delta.concat(concat)).toEqual(expected);
    });

    it('unmergeable', function () {
      var delta = new Delta().insert('Test');
      var original = new Delta(JSON.parse(JSON.stringify(delta)));
      var concat = new Delta().insert('!', { bold: true });
      var expected = new Delta().insert('Test').insert('!', { bold: true });
      expect(delta.concat(concat)).toEqual(expected);
      expect(delta).toEqual(original);
    });

    it('mergeable', function () {
      var delta = new Delta().insert('Test', { bold: true });
      var original = new Delta(JSON.parse(JSON.stringify(delta)));
      var concat = new Delta().insert('!', { bold: true }).insert('\n');
      var expected = new Delta().insert('Test!', { bold: true }).insert('\n');
      expect(delta.concat(concat)).toEqual(expected);
      expect(delta).toEqual(original);
    });
  });

  describe('chop()', function () {
    it('retain', function () {
      var delta = new Delta().insert('Test').retain(4);
      var expected = new Delta().insert('Test');
      expect(delta.chop()).toEqual(expected);
    });

    it('insert', function () {
      var delta = new Delta().insert('Test');
      var expected = new Delta().insert('Test');
      expect(delta.chop()).toEqual(expected);
    });

    it('formatted retain', function () {
      var delta = new Delta().insert('Test').retain(4, { bold: true });
      var expected = new Delta().insert('Test').retain(4, { bold: true });
      expect(delta.chop()).toEqual(expected);
    })
  });

  describe('eachLine()', function () {
    var spy = { predicate: function () {} };

    beforeEach(function () {
      spyOn(spy, 'predicate').and.callThrough();
    });

    it('expected', function () {
      var delta = new Delta().insert('Hello\n\n')
                             .insert('World', { bold: true })
                             .insert({ image: 'octocat.png' })
                             .insert('\n', { align: 'right' })
                             .insert('!');
      delta.eachLine(spy.predicate);
      expect(spy.predicate.calls.count()).toEqual(4);
      expect(spy.predicate.calls.argsFor(0)).toEqual([ new Delta().insert('Hello'), {}, 0 ]);
      expect(spy.predicate.calls.argsFor(1)).toEqual([ new Delta(), {}, 1 ]);
      expect(spy.predicate.calls.argsFor(2)).toEqual([
        new Delta().insert('World', { bold: true }).insert({ image: 'octocat.png' }),
        { align: 'right' },
        2
      ]);
      expect(spy.predicate.calls.argsFor(3)).toEqual([ new Delta().insert('!'), {}, 3 ]);
    });

    it('trailing newline', function () {
      var delta = new Delta().insert('Hello\nWorld!\n');
      delta.eachLine(spy.predicate);
      expect(spy.predicate.calls.count()).toEqual(2);
      expect(spy.predicate.calls.argsFor(0)).toEqual([ new Delta().insert('Hello'), {}, 0 ]);
      expect(spy.predicate.calls.argsFor(1)).toEqual([ new Delta().insert('World!'), {}, 1 ]);
    });

    it('non-document', function () {
      var delta = new Delta().retain(1).delete(2);
      delta.eachLine(spy.predicate);
      expect(spy.predicate.calls.count()).toEqual(0);
    });

    it('early return', function () {
      var delta = new Delta().insert('Hello\nNew\nWorld!');
      var count = 0;
      var spy = {
        predicate: function() {
          if (count === 1) return false;
          count += 1;
        }
      };
      spyOn(spy, 'predicate').and.callThrough();
      delta.eachLine(spy.predicate);
      expect(spy.predicate.calls.count()).toEqual(2);
    });
  });

  describe('iteration', function () {
    beforeEach(function() {
      this.delta = new Delta().insert('Hello').insert({ image: true }).insert('World!');
    });

    it('filter()', function () {
      var arr = this.delta.filter(function (op) {
        return typeof op.insert === 'string';
      });
      expect(arr.length).toEqual(2);
    })

    it('forEach()', function () {
      var spy = { predicate: function () {} };
      spyOn(spy, 'predicate').and.callThrough();
      this.delta.forEach(spy.predicate);
      expect(spy.predicate.calls.count()).toEqual(3);
    });

    it('map()', function () {
      var arr = this.delta.map(function (op) {
        return typeof op.insert === 'string' ? op.insert : '';
      });
      expect(arr).toEqual(['Hello', '', 'World!']);
    });

    it('partition()', function () {
      var arr = this.delta.partition(function (op) {
        return typeof op.insert === 'string';
      });
      var passed = arr[0], failed = arr[1];
      expect(passed).toEqual([this.delta.ops[0], this.delta.ops[2]]);
      expect(failed).toEqual([this.delta.ops[1]]);
    });
  });

  describe('length()', function () {
    it('document', function () {
      var delta = new Delta().insert('AB', { bold: true }).insert(1);
      expect(delta.length()).toEqual(3);
    });

    it('mixed', function () {
      var delta = new Delta().insert('AB', { bold: true }).insert(1).retain(2, { bold: null }).delete(1);
      expect(delta.length()).toEqual(6);
    });
  });

  describe('changeLength()', function () {
    it('mixed', function () {
      var delta = new Delta().insert('AB', { bold: true }).retain(2, { bold: null }).delete(1);
      expect(delta.changeLength()).toEqual(1);
    });
  });

  describe('slice()', function () {
    it('start', function () {
      var slice = new Delta().retain(2).insert('A').slice(2);
      var expected = new Delta().insert('A');
      expect(slice).toEqual(expected);
    });

    it('start and end chop', function () {
      var slice = new Delta().insert('0123456789').slice(2, 7);
      var expected = new Delta().insert('23456');
      expect(slice).toEqual(expected);
    });

    it('start and end multiple chop', function () {
      var slice = new Delta().insert('0123', { bold: true }).insert('4567').slice(3, 5);
      var expected = new Delta().insert('3', { bold: true }).insert('4');
      expect(slice).toEqual(expected);
    });

    it('start and end', function () {
      var slice = new Delta().retain(2).insert('A', { bold: true }).insert('B').slice(2, 3);
      var expected = new Delta().insert('A', { bold: true });
      expect(slice).toEqual(expected);
    });

    it('no params', function () {
      var delta = new Delta().retain(2).insert('A', { bold: true }).insert('B');
      var slice = delta.slice();
      expect(slice).toEqual(delta);
    });

    it('split ops', function () {
      var slice = new Delta().insert('AB', { bold: true }).insert('C').slice(1, 2);
      var expected = new Delta().insert('B', { bold: true });
      expect(slice).toEqual(expected);
    });

    it('split ops multiple times', function () {
      var slice = new Delta().insert('ABC', { bold: true }).insert('D').slice(1, 2);
      var expected = new Delta().insert('B', { bold: true });
      expect(slice).toEqual(expected);
    });
  });
});
