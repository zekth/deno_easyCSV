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
```
