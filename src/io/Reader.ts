import { Slice } from "../std";

export interface Reader {
  read(b:Slice): Promise<number>
}


export interface Writer {
  write(b:Slice): Promise<number>
}
