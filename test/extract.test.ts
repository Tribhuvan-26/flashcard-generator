// Run: node --experimental-strip-types test/extract.test.ts
import assert from "node:assert";
import { extractJson } from "../lib/extract.ts";

const arr = '[{"a":1}]';

// bare array
assert.strictEqual(extractJson(arr), arr);
// fenced with json tag
assert.strictEqual(extractJson("```json\n" + arr + "\n```"), arr);
// prose wrapping
assert.strictEqual(extractJson("Sure! " + arr + " Done."), arr);
// no array -> returns body unchanged (parse will fail downstream)
assert.strictEqual(extractJson("not json"), "not json");

console.log("extractJson: all passed");
