import { Slice } from "../std";

export interface Reader {
  Read(b:Slice): Promise<number>
}


export interface Writer {
  Write(b:Slice): Promise<number>
}
