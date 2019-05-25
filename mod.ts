import { readAll } from "https://deno.land/std/encoding/csv.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
import { StringReader } from "https://deno.land/std/io/readers.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

export interface HeaderOption {
  name: string;
  parse?: (string) => unknown;
}

export interface ParseOption {
  header: boolean | string[] | HeaderOption[];
  parse?: (unknown) => unknown;
}

export async function parse(
  input: string,
  opt: ParseOption = { header: false }
): Promise<unknown[]> {
  const [r, err] = await readAll(new BufReader(new StringReader(input)));
  if (err) throw err;
  if (opt.header) {
    let headers: HeaderOption[] = [];
    let i = 0;
    if (Array.isArray(opt.header)) {
      if (typeof opt.header[0] !== "string") {
        headers = opt.header as HeaderOption[];
      } else {
        const h = opt.header as string[];
        headers = h.map(
          (e): HeaderOption => {
            return {
              name: e
            };
          }
        );
      }
    } else {
      headers = r.shift().map(
        (e): HeaderOption => {
          return {
            name: e
          };
        }
      );
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
          if (h.parse) {
            out[h.name] = h.parse(e[j]);
          } else {
            out[h.name] = e[j];
          }
        }
        if (opt.parse) {
          return opt.parse(out);
        }
        return out;
      }
    );
  }
  if (opt.parse) {
    return r.map((e: string[]): unknown => opt.parse(e));
  }
  return r;
}

export async function parseFile(
  file: string,
  opt: ParseOption = { header: false }
): Promise<unknown[]> {
  return parse(await readFileStr(file), opt);
}
