var Delta = require('../../lib/delta');


describe('transform()', function () {
  it('insert + insert', function () {
    var a1 = new Delta().insert('A');
    var b1 = new Delta().insert('B');
    var a2 = new Delta(a1);
    var b2 = new Delta(b1);
    var expected1 = new Delta().retain(1).insert('B');
    var expected2 = new Delta().insert('B');
    expect(a1.transform(b1, true)).toEqual(expected1);
    expect(a2.transform(b2, false)).toEqual(expected2);
  });

  it('insert + retain', function () {
    var a = new Delta().insert('A');
    var b = new Delta().retain(1, { bold: true, color: 'red' });
    var expected = new Delta().retain(1).retain(1, { bold: true, color: 'red' });
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('insert + delete', function () {
    var a = new Delta().insert('A');
    var b = new Delta().delete(1);
    var expected = new Delta().retain(1).delete(1);
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('delete + insert', function () {
    var a = new Delta().delete(1);
    var b = new Delta().insert('B');
    var expected = new Delta().insert('B');
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('delete + retain', function () {
    var a = new Delta().delete(1);
    var b = new Delta().retain(1, { bold: true, color: 'red' });
    var expected = new Delta();
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('delete + delete', function () {
    var a = new Delta().delete(1);
    var b = new Delta().delete(1);
    var expected = new Delta();
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('retain + insert', function () {
    var a = new Delta().retain(1, { color: 'blue' });
    var b = new Delta().insert('B');
    var expected = new Delta().insert('B');
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('retain + retain', function () {
    var a1 = new Delta().retain(1, { color: 'blue' });
    var b1 = new Delta().retain(1, { bold: true, color: 'red' });
    var a2 = new Delta().retain(1, { color: 'blue' });
    var b2 = new Delta().retain(1, { bold: true, color: 'red' });
    var expected1 = new Delta().retain(1, { bold: true });
    var expected2 = new Delta();
    expect(a1.transform(b1, true)).toEqual(expected1);
    expect(b2.transform(a2, true)).toEqual(expected2);
  });

  it('retain + retain without priority', function () {
    var a1 = new Delta().retain(1, { color: 'blue' });
    var b1 = new Delta().retain(1, { bold: true, color: 'red' });
    var a2 = new Delta().retain(1, { color: 'blue' });
    var b2 = new Delta().retain(1, { bold: true, color: 'red' });
    var expected1 = new Delta().retain(1, { bold: true, color: 'red' });
    var expected2 = new Delta().retain(1, { color: 'blue' });
    expect(a1.transform(b1, false)).toEqual(expected1);
    expect(b2.transform(a2, false)).toEqual(expected2);
  });

  it('retain + delete', function () {
    var a = new Delta().retain(1, { color: 'blue' });
    var b = new Delta().delete(1);
    var expected = new Delta().delete(1);
    expect(a.transform(b, true)).toEqual(expected);
  });

  it('alternating edits', function () {
    var a1 = new Delta().retain(2).insert('si').delete(5);
    var b1 = new Delta().retain(1).insert('e').delete(5).retain(1).insert('ow');
    var a2 = new Delta(a1);
    var b2 = new Delta(b1);
    var expected1 = new Delta().retain(1).insert('e').delete(1).retain(2).insert('ow');
    var expected2 = new Delta().retain(2).insert('si').delete(1);
    expect(a1.transform(b1, false)).toEqual(expected1);
    expect(b2.transform(a2, false)).toEqual(expected2);
  });

  it('conflicting appends', function () {
    var a1 = new Delta().retain(3).insert('aa');
    var b1 = new Delta().retain(3).insert('bb');
    var a2 = new Delta(a1);
    var b2 = new Delta(b1);
    var expected1 = new Delta().retain(5).insert('bb');
    var expected2 = new Delta().retain(3).insert('aa');
    expect(a1.transform(b1, true)).toEqual(expected1);
    expect(b2.transform(a2, false)).toEqual(expected2);
  });

  it('prepend + append', function () {
    var a1 = new Delta().insert('aa');
    var b1 = new Delta().retain(3).insert('bb');
    var expected1 = new Delta().retain(5).insert('bb');
    var a2 = new Delta(a1);
    var b2 = new Delta(b1);
    var expected2 = new Delta().insert('aa');
    expect(a1.transform(b1, false)).toEqual(expected1);
    expect(b2.transform(a2, false)).toEqual(expected2);
  });

  it('trailing deletes with differing lengths', function () {
    var a1 = new Delta().retain(2).delete(1);
    var b1 = new Delta().delete(3);
    var expected1 = new Delta().delete(2);
    var a2 = new Delta(a1);
    var b2 = new Delta(b1);
    var expected2 = new Delta();
    expect(a1.transform(b1, false)).toEqual(expected1);
    expect(b2.transform(a2, false)).toEqual(expected2);
  });

  it('immutability', function () {
    var a1 = new Delta().insert('A');
    var a2 = new Delta().insert('A');
    var b1 = new Delta().insert('B');
    var b2 = new Delta().insert('B');
    var expected = new Delta().retain(1).insert('B');
    expect(a1.transform(b1, true)).toEqual(expected);
    expect(a1).toEqual(a2);
    expect(b1).toEqual(b2);
  });
});
