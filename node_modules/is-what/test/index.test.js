// @ts-check
import {
  isBlob,
  isFile,
} from '../dist/index.cjs'

test('isBlob', () => {
  expect(isBlob(Blob)).toBe(false)
  expect(isBlob(new Blob())).toBe(true)
})

test('isFile', () => {
  expect(isFile(File)).toBe(false)
  expect(isFile(new File([''], '', { type: 'text/html' }))).toBe(true)
})
