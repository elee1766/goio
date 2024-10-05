import { Slice } from "../";

export class Buffer {
  private buf: Slice;
  private off: number;

  constructor(buf?: Slice) {
    this.buf = buf || Slice.Make(0);
    this.off = 0;
  }

  write(p: Uint8Array): number {
    this.buf = this.buf.append(Slice.New(p));
    return p.length;
  }

  writeString(s: string): number {
    return this.write(new TextEncoder().encode(s));
  }

  read(p: Uint8Array): number {
    if (this.off >= this.buf.length) {
      return 0; // EOF
    }
    const n = Math.min(p.length, this.buf.length - this.off);
    p.set(this.buf.array.subarray(this.off, this.off + n));
    this.off += n;
    return n;
  }

  bytes(): Uint8Array {
    return this.buf.array.subarray(this.off);
  }

  toString(): string {
    return new TextDecoder().decode(this.bytes());
  }

  reset(): void {
    this.buf = Slice.Make(0);
    this.off = 0;
  }

  length(): number {
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
