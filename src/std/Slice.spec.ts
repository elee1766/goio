import { describe, it, expect, test } from 'vitest'
import {Slice} from './Slice'

function isSlice(a: unknown): a is Slice {
  return a instanceof Slice
}
function areSlicesEqual(a: unknown, b:unknown) : boolean | undefined{
  if(isSlice(a) && isSlice(b)) {
    return a.equals(b)
  }else if(isSlice(a) === isSlice(b)) {
    return undefined
  }
  return false
}

expect.addEqualityTesters([areSlicesEqual])



describe('Slice', () => {


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

  it('should correctly create a new Slice instance using Uint8Array', () => {
    const array = new Uint8Array([1, 2, 3, 4]);
    const slice = Slice.New(array, 4);
    expect(slice.array).toEqual(array);
    expect(slice.length).toBe(4);
  });

  it('should correctly create a new Slice instance using string', () => {
    const str = 'test';
    const slice = Slice.New(str, 4);
    expect(slice.array).toEqual(new TextEncoder().encode(str));
    expect(slice.length).toBe(4);
  });

  it('should correctly create a new Slice instance using ArrayBuffer', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    const slice = Slice.New(buffer, 4);
    expect(slice.array).toEqual(new Uint8Array(buffer));
    expect(slice.length).toBe(4);
  });

  it('should correctly create a Slice using Make with default parameters', () => {
    const slice = Slice.Make();
    expect(slice.array).toEqual(new Uint8Array(0));
    expect(slice.length).toBe(0);
  });

  it('should correctly create a Slice using Make with length and capacity', () => {
    const slice = Slice.Make(4, 8);
    expect(slice.array.length).toBe(8);
    expect(slice.length).toBe(4);
  });

  it('should copy one Slice to another', () => {
    const src = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    const dst = new Slice(new Uint8Array(4), 4);
    const copiedLen = Slice.copy(dst, src);
    expect(dst.array).toEqual(src.array);
    expect(copiedLen).toBe(4);
  });

  it('should get a value at a specific index', () => {
    const slice = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    expect(slice.get(2)).toBe(3);
  });

  it('should get a sub-slice', () => {
    const slice = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    const subSlice = slice.get(1, 3);
    expect(subSlice.array).toEqual(new Uint8Array([2, 3]));
    expect(subSlice.length).toBe(2);
  });

  it('should slice correctly', () => {
    const slice = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    const result = slice.slice(1, 3);
    expect(result.array).toEqual(new Uint8Array([2, 3]));
    expect(result.length).toBe(2);
  });

  it('should correctly compare equal slices', () => {
    const slice = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    const equalArray = new Uint8Array([1, 2, 3, 4]);
    expect(slice.equals(equalArray)).toBe(true);
  });

  it('should correctly compare non-equal slices', () => {
    const slice = new Slice(new Uint8Array([1, 2, 3, 4]), 4);
    const nonEqualArray = new Uint8Array([4, 3, 2, 1]);
    expect(slice.equals(nonEqualArray)).toBe(false);
  });

  it('should append slices correctly', () => {
    const slice1 = new Slice(new Uint8Array([1, 2]), 2);
    const slice2 = new Slice(new Uint8Array([3, 4]), 2);
    const result = slice1.append(slice2);
    expect(result).toEqual(Slice.New([1, 2, 3, 4]));
    expect(result.length).toBe(4);
  });



});
