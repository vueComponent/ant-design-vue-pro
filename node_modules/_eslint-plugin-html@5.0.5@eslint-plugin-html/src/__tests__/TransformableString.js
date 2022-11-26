"use strict"

const TransformableString = require("../TransformableString")

it("should be a function", () => {
  expect(typeof TransformableString).toBe("function")
})

describe("toString", () => {
  it("should return the original string if no transform are made", () => {
    const ts = new TransformableString("foo")
    expect(ts.toString()).toBe("foo")
  })
})

describe("replace", () => {
  it("should replace a slice", () => {
    const ts = new TransformableString("foo")
    ts.replace(1, 2, "OO")
    expect(ts.toString()).toBe("fOOo")
  })

  it("should throw if trying to replace the same thing twice", () => {
    const ts = new TransformableString("abcd")
    ts.replace(1, 3, "OO")
    expect(() => ts.replace(2, 4, "OO")).toThrow()
    expect(() => ts.replace(0, 2, "OO")).toThrow()
  })

  it("should replace adjacent slices", () => {
    const ts = new TransformableString("abcde")
    ts.replace(2, 3, "OO")
    ts.replace(3, 4, "MM")
    ts.replace(1, 2, "NN")
    expect(ts.toString()).toBe("aNNOOMMe")
  })
})

describe("originalIndex", () => {
  it("should return the same index if nothing changed", () => {
    const ts = new TransformableString("abcde")
    expect(ts.originalIndex(0)).toBe(0)
    expect(ts.originalIndex(1)).toBe(1)
    expect(ts.originalIndex(4)).toBe(4)
  })

  it("should throw if the index is invalid", () => {
    const ts = new TransformableString("abcde")
    expect(() => ts.originalIndex(-1)).toThrow()
    expect(() => ts.originalIndex(6)).toThrow()
  })

  it("should return the original index of a string with removed parts", () => {
    const ts = new TransformableString("abcde")
    ts.replace(1, 2, "")
    ts.replace(3, 4, "")
    expect(ts.toString()).toBe("ace")
    expect(ts.originalIndex(0)).toBe(0) // a
    expect(ts.originalIndex(1)).toBe(2) // c
    expect(ts.originalIndex(2)).toBe(4) // e
    expect(ts.originalIndex(3)).toBe(5) // index directly after the end is allowed
    expect(() => ts.originalIndex(4)).toThrow()
  })

  it("should return the original index of a string with added parts", () => {
    const ts = new TransformableString("ace")
    ts.replace(1, 1, "b")
    ts.replace(2, 2, "d")
    expect(ts.toString()).toBe("abcde")
    expect(ts.originalIndex(0)).toBe(0) // a
    expect(ts.originalIndex(1)).toBe(undefined)
    expect(ts.originalIndex(2)).toBe(1) // c
    expect(ts.originalIndex(3)).toBe(undefined)
    expect(ts.originalIndex(4)).toBe(2) // e
    expect(ts.originalIndex(5)).toBe(3) // index directly after the end is allowed
    expect(() => ts.originalIndex(6)).toThrow()
  })

  it("should return the original index of a string with added parts (2)", () => {
    const ts = new TransformableString("ab")
    ts.replace(1, 1, "XX")
    expect(ts.toString()).toBe("aXXb")
    expect(ts.originalIndex(0)).toBe(0) // a
    expect(ts.originalIndex(1)).toBe(undefined)
    expect(ts.originalIndex(2)).toBe(undefined)
    expect(ts.originalIndex(3)).toBe(1) // b
  })

  it("should return the last index of the last block if the index is after the end", () => {
    const ts = new TransformableString("abcd")
    ts.replace(2, 4, "X")
    expect(ts.toString()).toBe("abX")
    expect(ts.originalIndex(0)).toBe(0) // a
    expect(ts.originalIndex(1)).toBe(1) // b
    expect(ts.originalIndex(2)).toBe(undefined)
    expect(ts.originalIndex(3)).toBe(3) // c
  })
})

describe("originalLocation", () => {
  it("should return the same location if nothing changed", () => {
    const ts = new TransformableString("aaaa\nbbbb\ncccc")
    expect(ts.originalLocation({ line: 1, column: 1 })).toEqual({
      line: 1,
      column: 1,
    })
    expect(ts.originalLocation({ line: 1, column: 3 })).toEqual({
      line: 1,
      column: 3,
    })
    expect(ts.originalLocation({ line: 2, column: 1 })).toEqual({
      line: 2,
      column: 1,
    })
  })

  it("should return the original location of a string with removed parts", () => {
    const ts = new TransformableString("aaaa\nbbbb\ncccc")
    ts.replace(3, 6, "")
    expect(ts.toString()).toBe("aaabbb\ncccc")
    expect(ts.originalLocation({ line: 1, column: 1 })).toEqual({
      line: 1,
      column: 1,
    })
    expect(ts.originalLocation({ line: 1, column: 4 })).toEqual({
      line: 2,
      column: 2,
    })
    expect(ts.originalLocation({ line: 2, column: 1 })).toEqual({
      line: 3,
      column: 1,
    })
  })

  it("should return the original location of a string with added parts", () => {
    const ts = new TransformableString("aaaa\nbbbbcccc")
    ts.replace(9, 9, "X\nX")
    expect(ts.toString()).toBe("aaaa\nbbbbX\nXcccc")
    expect(ts.originalLocation({ line: 1, column: 1 })).toEqual({
      line: 1,
      column: 1,
    })
    expect(ts.originalLocation({ line: 1, column: 4 })).toEqual({
      line: 1,
      column: 4,
    })
    expect(ts.originalLocation({ line: 2, column: 1 })).toEqual({
      line: 2,
      column: 1,
    })
    expect(ts.originalLocation({ line: 2, column: 5 })).toEqual(undefined)
  })
})

describe("getOriginalLine", () => {
  it("returns original lines", () => {
    const ts = new TransformableString("aa\nbb\r\ncc")
    expect(() => ts.getOriginalLine(0)).toThrow()
    expect(ts.getOriginalLine(1)).toEqual("aa")
    expect(ts.getOriginalLine(2)).toEqual("bb")
    expect(ts.getOriginalLine(3)).toEqual("cc")
    expect(() => ts.getOriginalLine(4)).toThrow()
  })
})
