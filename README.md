# Deno easyCSV [![Build Status](https://travis-ci.org/zekth/deno_easycsv.svg?branch=master)](https://travis-ci.org/zekth/deno_easycsv)

Wrapper to of [Deno](https://github.com/denoland/deno) [encoding/csv](https://github.com/denoland/deno_std/blob/master/encoding/csv.ts) to provide several possibilities of data manipulations.

## Concept

easyCSV provide `parse` function for the whole parser or each header. Therefore you can apply parsing function to the whole row or each column.

## API

- **`parse(csvString: string, opt: ParseOption): Promise<unknown[]>`**: Parse the CSV string with the options provided.
- **`parseFile(filepath: string, opt: ParseOption): Promise<unknown[]>`**: Open the csv file and parse the data with the options provided.

### Options

#### ParseOption

- **`header: boolean | string[] | HeaderOption[];`**: If a boolean is provided, the first line will be used as Header definitions. If `string[]` or `HeaderOption[]` those names will be used for header definition.
- **`parse?: (input: unknown) => unknown;`**: Parse function for the row, which will be executed after parsing of all columns. Therefore if you don't provide header and parse function with headers, input will be `string[]`.

#### HeaderOption

- **`name: string;`**: Name of the header to be used as property.
- **`parse?: (input: string) => unknown;`**: Parse function for the column. This is executed on each entry of the header. This can be combined with the Parse function of the rows.

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
  parse: (e: Record<string, unknown>) => {
    return { super: e.this, street: e.is, fighter: e.sparta };
  }
});
// output:
// [
//   { super: "a", street: "b", fighter: "c" },
//   { super: "e", street: "f", fighter: "g" }
// ]
```
