import { readAll } from "https://deno.land/std/encoding/csv.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
import { StringReader } from "https://deno.land/std/io/readers.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

export interface ParseOption {
  header: boolean | string[];
}

export async function parse(
  input: string,
  opt: ParseOption = { header: false }
): Promise<unknown[]> {
  const [r, err] = await readAll(new BufReader(new StringReader(input)));
  if (err) throw err;
  if (opt.header) {
    let headers = [];
    let i = 0;
    if (Array.isArray(opt.header)) {
      headers = opt.header;
    } else {
      headers = r.shift();
      i++;
    }
    return r.map(
      (e): unknown => {
        if (e.length !== headers.length) {
          throw `Error number of fields line:${i}`;
        }
        i++;
        let out = {};
        for (let j = 0; j < e.length; j++) {
          const h = headers[j];
          out[h] = e[j];
        }
        return out;
      }
    );
  }
  return r;
}

export async function parseFile(
  file: string,
  opt: ParseOption = { header: false }
): Promise<unknown[]> {
  return parse(await readFileStr(file), opt);
}
