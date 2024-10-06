import * as io from "@goio/io"
import { Slice } from "@goio/";

export class Reader implements io.Reader {
    private buffer: Slice;
    private reader: Reader;
    private bufSize: number;
    private pos: number;

    constructor(reader: Reader, bufSize: number = 4096) {
        this.reader = reader;
        this.bufSize = bufSize;
        this.buffer = Slice.Make(bufSize);
        this.pos = 0;
    }

    async Read(p: Slice): Promise<number> {
        if (this.pos >= this.buffer.length) {
            this.pos = 0;
            const n = await this.reader.Read(this.buffer);
            if (n <= 0) {
                return n;
            }
        }
        const n = Math.min(p.length, this.buffer.length - this.pos);
        p.array.set(this.buffer.array.subarray(this.pos, this.pos + n));
        this.pos += n;
        return n;
    }

    async ReadSlice(delim: number): Promise<Slice> {
        let start = this.pos;
        while (true) {
            for (let i = this.pos; i < this.buffer.length; i++) {
                if (this.buffer.get(i) === delim) {
                    const slice = this.buffer.get(start, i + 1);
                    this.pos = i + 1;
                    return slice;
                }
            }
            this.pos = this.buffer.length;
            const n = await this.reader.Read(this.buffer);
            if (n <= 0) {
                break;
            }
        }
        return this.buffer.get(start, this.buffer.length);
    }

    async ReadString(delim: number): Promise<string> {
        const slice = await this.ReadSlice(delim);
        return new TextDecoder().decode(slice.array);
    }

    Peek(n: number): Slice {
        if (n > this.buffer.length - this.pos) {
            throw new Error("BufferedReader: Peek out of range");
        }
        return this.buffer.get(this.pos, this.pos + n);
    }

    Reset(reader: Reader): void {
        this.reader = reader;
        this.buffer = Slice.Make(this.bufSize);
        this.pos = 0;
    }
}
