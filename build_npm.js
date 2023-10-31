#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run
// This script packages this module as an npm package. See https://github.com/denoland/dnt.
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

if (Deno.args.length != 1) {
  console.log("Usage: build_npm.js VERSION");
  Deno.exit(1);
}

await build({
  entryPoints: ["./shoulda.js"],
  test: false,
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: "shoulda.js",
    version: Deno.args[0],
    description: "Concise JavaScript unit testing micro framework.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/philc/shoulda.js.git",
    },
    bugs: {
      url: "https://github.com/philc/shoulda.js/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
