import { expect, test } from 'vitest'
import {Slice} from './Slice'



test('makeslice correct len and cap', ()=>{
  const xs = Slice.Make(3, 8)

  expect(xs.length).toBe(3)
  expect(xs.cap).toBe(8)
})

test('append works', ()=>{
  let xs = Slice.Make(0, 8)
  xs = xs.append(
    Slice.New(new Uint8Array([1,2,3]), 3)
  )

  expect(xs.length).toBe(3)
  expect(xs.get(0)).toBe(1)
  expect(xs.get(1)).toBe(2)
  expect(xs.get(2)).toBe(3)
  expect(xs.length).toBe(3)
  expect(xs.cap).toBe(8)
})
