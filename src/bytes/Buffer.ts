import { Slice, Reader, Writer } from '../';


export class Buffer implements Reader, Writer {
  private buf: Slice;
  private off: number;

  constructor(buf?: Slice) {
    this.buf = buf || Slice.Make(0);
    this.off = 0;
  }

  async write(p: Slice): Promise<number> {
    this.buf = this.buf.append(p);
    return p.length;
  }

  async writeString(s: string): Promise<number> {
    return this.write(Slice.New(s));
  }

  async read(p: Slice): Promise<number> {
    if (this.off >= this.buf.length) {
      return 0; // EOF
    }
    const n = Math.min(p.length, this.buf.length - this.off);
    p.array.set(this.buf.array.subarray(this.off, this.off + n));
    this.off += n;
    return n;
  }

  get bytes(): Slice {
    return this.buf
  }

  toString(): string {
    return new TextDecoder().decode(this.bytes.array.subarray(0, this.length));
  }

  reset(): void {
    this.buf = Slice.Make(0);
    this.off = 0;
  }

  get length(): number {
    return this.buf.length - this.off;
  }

  truncate(n: number): void {
    if (n < 0 || n > this.buf.length) {
      throw new Error("bytes.Buffer: truncation out of range");
    }
    if (n === 0) {
      this.reset();
    } else {
      this.buf = this.buf.slice(0, n);
    }
    if (this.off > n) {
      this.off = n;
    }
  }
}
