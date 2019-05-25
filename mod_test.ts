import { test, runIfMain } from "https://deno.land/std@v0.6/testing/mod.ts";
import { assertEquals } from "https://deno.land/std@v0.6/testing/asserts.ts";
import { parseFile } from "./mod.ts";
import { join } from "https://deno.land/std@v0.6/fs/path.ts";

const testCases = [
  {
    name: "simple",
    file: "simple.csv",
    header: false,
    result: [["a", "b", "c"]]
  },
  {
    name: "multiline",
    file: "multiline.csv",
    header: false,
    result: [["a", "b", "c"], ["e", "f", "g"]]
  },
  {
    name: "header mapping boolean",
    file: "multiline.csv",
    header: true,
    result: [{ a: "e", b: "f", c: "g" }]
  },
  {
    name: "header mapping array",
    file: "multiline.csv",
    header: ["this", "is", "sparta"],
    result: [
      { this: "a", is: "b", sparta: "c" },
      { this: "e", is: "f", sparta: "g" }
    ]
  },
  {
    name: "header mapping object",
    file: "multiline.csv",
    header: [{ name: "this" }, { name: "is" }, { name: "sparta" }],
    result: [
      { this: "a", is: "b", sparta: "c" },
      { this: "e", is: "f", sparta: "g" }
    ]
  },
  {
    name: "header mapping parse entry",
    file: "multiline.csv",
    header: [
      {
        name: "this",
        parse: (e: string): string => {
          return `b${e}$$`;
        }
      },
      {
        name: "is",
        parse: (e: string): number => {
          return e.length;
        }
      },
      {
        name: "sparta",
        parse: (e: string): unknown => {
          return { bim: `boom-${e}` };
        }
      }
    ],
    result: [
      { this: "ba$$", is: 1, sparta: { bim: `boom-c` } },
      { this: "be$$", is: 1, sparta: { bim: `boom-g` } }
    ]
  },
  {
    name: "multiline parse",
    file: "multiline.csv",
    parse: (e: string[]): unknown => {
      return { super: e[0], street: e[1], fighter: e[2] };
    },
    header: false,
    result: [
      { super: "a", street: "b", fighter: "c" },
      { super: "e", street: "f", fighter: "g" }
    ]
  },
  {
    name: "header mapping object parseline",
    file: "multiline.csv",
    header: [{ name: "this" }, { name: "is" }, { name: "sparta" }],
    parse: (e: Record<string, unknown>): unknown => {
      return { super: e.this, street: e.is, fighter: e.sparta };
    },
    result: [
      { super: "a", street: "b", fighter: "c" },
      { super: "e", street: "f", fighter: "g" }
    ]
  }
];

for (const testCase of testCases) {
  test({
    name: `[easyCSV] ${testCase.name}`,
    async fn(): Promise<void> {
      const r = await parseFile(join("test_data", testCase.file), {
        header: testCase.header,
        parse: testCase.parse
      });
      assertEquals(r, testCase.result);
    }
  });
}
runIfMain(import.meta);
