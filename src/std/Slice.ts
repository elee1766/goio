import invariant from 'tiny-invariant';


export class Slice {

  static New(arr: Uint8Array, len: number): Slice;
  static New(arr: Uint8Array | ArrayBufferLike | "string", len: number): Slice {
    if(arr instanceof Uint8Array) {
      return new Slice(arr, len)
    }
    if(typeof arr == "string") {
      return new Slice(new TextEncoder().encode(arr), len)
    }
    return new Slice(new Uint8Array(arr), len)
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


  private array: Uint8Array
  len: number


  constructor(array: Uint8Array, len: number) {
    this.array = array
    this.len = len
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


  _array(): Uint8Array  {
    return this.array
  }

  equals(o?:Uint8Array):boolean {
    if(o === undefined) {
      return false
    }
    if(this.len != o.length){
      return false
    }
    for(let idx = 0; idx < o.length; idx++) {
      if(this.array[idx] !== o[idx]) {
        return false
      }
    }
    return true
  }

  append(...xs: Slice[]): Slice {
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
    increase = 0
    for(const x of xs) {
      increase = increase + x.len
    }
    slice.len = slice.len + increase
    return slice
  }


  slice(from: number = 0, to?: number): Slice {
    const slice = new Slice(this.array, this.len)
    if(to === undefined) {
      to = slice.len
    }
    invariant(to >= slice.len,"index out of bounds")
    slice.array = new Uint8Array(slice.array, from, to)
    slice.len = from - to
    return slice
  }

  s(from: number = 0, to?: number): Slice {
    return this.s(from, to)
  }

  private growslice(newLen: number) {
    const oldCap = this.array.length
    invariant(newLen + oldCap < Number.MAX_SAFE_INTEGER, 'overflow')
    const newCap = this.nextslicecap(newLen, oldCap)
    const newArray = new Uint8Array(newCap)
    newArray.set(this.array)
    this.array = newArray
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
