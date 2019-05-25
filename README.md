# Deno easyCSV [![Build Status](https://travis-ci.org/zekth/deno_easycsv.svg?branch=master)](https://travis-ci.org/zekth/deno_easycsv)

`

## Usage

```ts
// input:
// a,b,c
// e,f,g

const r = await parseFile(filepath, {
  header: false
});
// output:
// [["a", "b", "c"], ["e", "f", "g"]]

const r = await parseFile(filepath, {
  header: true
});
// output:
// [{ a: "e", b: "f", c: "g" }]

const r = await parseFile(filepath, {
  header: ["this", "is", "sparta"]
});
// output:
// [
//   { this: "a", is: "b", sparta: "c" },
//   { this: "e", is: "f", sparta: "g" }
// ]

const r = await parseFile(filepath, {
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
    ]
});
// output:
// [
//    { this: "ba$$", is: 1, sparta: { bim: `boom-c` } },
//    { this: "be$$", is: 1, sparta: { bim: `boom-g` } }
// ]

const r = await parseFile(filepath, {
  header: ["this", "is", "sparta"],
  parse: (e: Record<string,unknown>) => {
    return { super: e.this, street: e.is, fighter: e.sparta };
  }
});
// output:
// [
//   { super: "a", street: "b", fighter: "c" },
//   { super: "e", street: "f", fighter: "g" }
// ]
```
