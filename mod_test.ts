import { test, runIfMain } from "https://deno.land/std@v0.6/testing/mod.ts";
import {
  assertEquals,
  assert
} from "https://deno.land/std@v0.6/testing/asserts.ts";
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
    name: "header mapping",
    file: "multiline.csv",
    header: true,
    result: [{ a: "e", b: "f", c: "g" }]
  },
  {
    name: "header mapping",
    file: "multiline.csv",
    header: ["this", "is", "sparta"],
    result: [
      { this: "a", is: "b", sparta: "c" },
      { this: "e", is: "f", sparta: "g" }
    ]
  }
];

for (const testCase of testCases) {
  test({
    name: `[easyCSV] ${testCase.name}`,
    async fn(): Promise<void> {
      const r = await parseFile(join("test_data", testCase.file), {
        header: testCase.header
      });
      assertEquals(r, testCase.result);
    }
  });
}
runIfMain(import.meta);
