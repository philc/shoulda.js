#!/usr/bin/env -S deno run --allow-read
/*
 * A test runner which discovers and runs shoulda test files. It runs in both Deno and Node.
 *
 * Usage:
 *   run_tests.js [paths...] [--filter <string>]
 *
 * - paths: test files to run, or directories to search for test files. Test files should be named
 *   *_test.js or *.test.js. Defaults to the current directory.
 * - --filter: only tests whose fully-qualified name includes this string will be run.
 *
 * Examples, from a Deno project which has run `deno add jsr:@philc/shoulda`:
 *   deno run -A @philc/shoulda/run
 *   deno run -A @philc/shoulda/run my-test-dir --filter "example test name"
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as url from "node:url";
import * as util from "node:util";
import * as shoulda from "./shoulda.js";

// Directories to skip while walking, so we don't descend into dependency or VCS folders.
const skipDirs = new Set(["node_modules"]);

const isTestFile = (name) => name.endsWith("_test.js") || name.endsWith(".test.js");

async function findTestFiles(dir) {
  const testFiles = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name) && !entry.name.startsWith(".")) {
        testFiles.push(...await findTestFiles(entryPath));
      }
    } else if (entry.isFile() && isTestFile(entry.name)) {
      testFiles.push(entryPath);
    }
  }
  return testFiles;
}

// This avoids top-level await, so that the npm package's CommonJS build (see build_npm.js) works.
async function main() {
  let args;
  try {
    args = util.parseArgs({ allowPositionals: true, options: { filter: { type: "string" } } });
  } catch (error) {
    console.log(error.message);
    console.log("Usage: run_tests.js [paths...] [--filter <string>]");
    process.exit(1);
  }
  const paths = args.positionals.length > 0 ? args.positionals : ["."];

  const testFiles = new Set();
  for (const p of paths) {
    let stat;
    try {
      stat = await fs.stat(p);
    } catch {
      console.log(`No such file or directory: ${p}`);
      process.exit(1);
    }
    const files = stat.isDirectory() ? await findTestFiles(path.resolve(p)) : [path.resolve(p)];
    for (const f of files) {
      testFiles.add(f);
    }
  }
  if (testFiles.size == 0) {
    const where = paths.join(", ");
    console.log(`No test files found in ${where}.`);
    process.exit(1);
  }

  for (const file of [...testFiles].sort()) {
    await import(url.pathToFileURL(file).href);
  }

  const ok = await shoulda.run(args.values.filter);
  process.exit(ok ? 0 : 1);
}

main();
