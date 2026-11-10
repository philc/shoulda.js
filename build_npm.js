#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run
// This script packages this module as an npm package. See https://github.com/denoland/dnt.
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

if (Deno.args.length != 1) {
  console.log("Usage: build_npm.js VERSION");
  Deno.exit(1);
}

await build({
  entryPoints: [
    "./shoulda.js",
    // Installs the test runner as the `shoulda` command, for use in package.json scripts.
    { kind: "bin", name: "shoulda", path: "./run_tests.js" },
  ],
  test: false,
  // Only build an ES module. Node supports them, including via require() since Node 23.
  scriptModule: false,
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
    // dnt exports the module under the "import" condition only. Export it unconditionally, so that
    // CommonJS code can require() it too.
    const packageJson = JSON.parse(Deno.readTextFileSync("npm/package.json"));
    packageJson.exports["."] = "./esm/shoulda.js";
    Deno.writeTextFileSync("npm/package.json", JSON.stringify(packageJson, null, 2) + "\n");
  },
});
