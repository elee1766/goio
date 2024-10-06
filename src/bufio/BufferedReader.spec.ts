import { describe, it, expect } from 'vitest';
import { BufferedReader, Buffer, Slice } from '../';

describe('BufferedReader', () => {
  it('should read bytes correctly', async () => {
    const input = Slice.New([1, 2, 3, 4]);
    const buffer = new Buffer(input);
    const reader = new BufferedReader(buffer, 4);

    const output = Slice.Make(4);
    const n = await reader.read(output);

    expect(n).toBe(4);
    expect(output).toEqual(input);
  });

  it('should read slice by delimiter correctly', async () => {
    const input = Slice.New([1, 2, 3, 4, 5]);
    const buffer = new Buffer(input);
    const reader = new BufferedReader(buffer, 5);

    const slice = await reader.ReadSlice(3);
    expect(slice.array).toEqual([1, 2, 3]);
  });

  it('should read string by delimiter correctly', async () => {
    const input = Slice.New('hello, world');
    const buffer = new Buffer(input);
    const reader = new BufferedReader(buffer, 12);

    const str = await reader.ReadString(','.charCodeAt(0));
    expect(str).toBe('hello,');
  });

  it('should peek bytes correctly', () => {
    const input = Slice.New(new Uint8Array([1, 2, 3, 4]));
    const buffer = new Buffer(input);
    const reader = new BufferedReader(buffer, 4);

    const slice = reader.Peek(2);
    expect(slice.array).toEqual(new Uint8Array([1, 2]));
  });

  it('should reset reader correctly', () => {
    const input = Slice.New(new Uint8Array([1, 2, 3, 4]));
    const buffer = new Buffer(input);
    const reader = new BufferedReader(buffer, 4);
    reader.Reset(buffer);

    const output = Slice.Make(4);
    reader.read(output).then(n => {
      expect(n).toBe(4);
      expect(output.array).toEqual(input.array);
    });
  });
});
