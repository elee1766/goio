import { describe, it, expect } from 'vitest';
import { Buffer, Slice } from '../';

describe('Buffer', () => {
  it('should write and read bytes correctly', async () => {
    const buf = new Buffer();
    const data = Slice.New(new Uint8Array([1, 2, 3, 4]));
    await buf.write(data);

    const readData = Slice.Make(4);
    const n = await buf.read(readData);

    expect(n).toBe(4);
    expect(readData.array).toEqual(data.array);
  });

  it('should write and read strings correctly', async () => {
    const buf = new Buffer();
    const str = 'hello';
    await buf.writeString(str);

    const readStr = buf.toString();
    expect(readStr).toBe(str);
  });

  it('should reset buffer correctly', async () => {
    const buf = new Buffer();
    await buf.writeString('test');
    buf.reset();
    expect(buf.length).toBe(0);
  });

  it('should truncate buffer correctly', async () => {
    const buf = new Buffer();
    await buf.writeString('hello world');
    buf.truncate(5);
    expect(buf.toString()).toBe('hello');
  });
});
