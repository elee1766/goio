import invariant from 'tiny-invariant';


export class Slice {

  constructor(array: Uint8Array, len: number) {
    this.arr = array
    this.len = len
  }

  static New(arr: number[]): Slice;
  static New(arr: string): Slice;
  static New(arr: Uint8Array): Slice;
  static New(arr: ArrayBufferLike): Slice;
  static New(arr: string, len: number): Slice;
  static New(arr: Uint8Array, len: number): Slice;
  static New(arr: ArrayBufferLike, len: number): Slice;
  static New(arr: Uint8Array | ArrayBufferLike | string | number[], len?: number): Slice {
    if(arr instanceof Uint8Array) {
      if(len === undefined) {
        len = arr.length
      }
      return new Slice(arr, len)
    }
    if(typeof arr == "string") {
      if(len === undefined) {
        len = arr.length
      }
      return new Slice(new TextEncoder().encode(arr), len)
    }
    let ua = new Uint8Array(arr)
    if(len === undefined) {
      len = ua.byteLength
    }
    return new Slice(ua, len)
  }

  static Make(): Slice;
  static Make(len:number): Slice;
  static Make(len:number, cap?:number): Slice;
  static Make(len?:number, cap?:number): Slice{
    if(len === undefined) {
      len = 0
    }
    if(cap === undefined) {
      cap = 0
    }
    invariant(cap >= len, "cap must be greater or equal to len")
    return new Slice(new Uint8Array(cap), len)
  }

  static copy(dst: Slice, src: Slice): number {
    const len = Math.min(dst.len, src.len);
    dst.array.set(src.array.subarray(0, len), 0);
    return len;
  }


  private arr: Uint8Array
  private len: number




  public get array() {
    return this.arr
  }

  public get length() {
    return this.len
  }

  public get cap() {
    return this.array.length
  }

  public get(from: number): number;
  public get(from: number, to: number): Slice;
  public get(from: number, to?: number): number | Slice {
    if(to === undefined) {
      invariant(from < this.length, "index out of bounds")
      return this.array[from]
    }
    return this.slice(from, to)
  }


  public equals(o?:any):boolean {
    if(o === undefined) {
      return false
    }
    let ua: Uint8Array
    if(o instanceof Slice) {
      ua = o.array
    }
    else if (o instanceof Uint8Array) {
      ua = o
    }
    else if (o instanceof Buffer) {
      ua = new Uint8Array(o)
    }
    else if (typeof o === "string") {
      ua = new TextEncoder().encode(o)
    }
    else {
      return false
    }
    if(this.len != ua.length){
      return false
    }
    for(let idx = 0; idx < this.len; idx++) {
      if(this.array[idx] !== ua[idx]) {
        return false
      }
    }
    return true
  }

  public append(...xs: Slice[]): Slice {
    // make shallow copy
    const slice = new Slice(this.array, this.len)
    // the new array
    let increase = 0
    for(const x of xs) {
      increase = increase + x.len
    }
    if(slice.len + increase > slice.array.length){
      slice.growslice(slice.len + increase)
    }
    let offset = slice.len
    for(const x of xs) {
      slice.array.set(x.array, offset);
      offset += x.len
    }
    slice.len = slice.len + increase
    return slice
  }


  public slice(from: number = 0, to?: number): Slice {
    const slice = new Slice(this.array, this.len)
    if(to === undefined) {
      to = slice.len
    }
    invariant(to <= slice.len,"index out of bounds")
    invariant(to >= from, "to must be greater than or equal to from")
    slice.arr = slice.array.subarray( from, to)
    slice.len = to - from
    return slice
  }

  private growslice(newLen: number) {
    const oldCap = this.array.length
    invariant(newLen + oldCap < Number.MAX_SAFE_INTEGER, 'overflow')
    const newCap = this.nextslicecap(newLen, oldCap)
    const newArray = new Uint8Array(newCap)
    newArray.set(this.array)
    this.arr = newArray
  }

  private nextslicecap(newLen: number, oldCap: number): number {
    let newcap = oldCap;
    let doublecap = newcap + newcap;

    if (newLen > doublecap) {
      return newLen;
    }

    const threshold = 256;

    if (oldCap < threshold) {
      return doublecap;
    }

    while (true) {
      // Transition from growing 2x for small slices
      // to growing 1.25x for large slices. This formula
      // gives a smooth-ish transition between the two.
      newcap += (newcap + 3 * threshold) >> 2;

      // We need to check newcap >= newLen and whether newcap overflowed.
      // newLen is guaranteed to be larger than zero, hence
      // when newcap overflows then uint(newcap) > uint(newLen).
      // This allows to check for both with the same comparison.
      if (newcap >= newLen) {
        break;
      }
    }

    // Set newcap to the requested cap when
    // the newcap calculation overflowed.
    if (newcap <= 0) {
      return newLen;
    }

    return newcap;
  }

}
