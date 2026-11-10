# Shoulda.js

Shoulda.js is a JavaScript unit testing micro framework. It provides syntax for writing concise,
readable tests. It makes no assumptions about your JavaScript environment or libraries. At about 280
lines of code, it's easy to understand and modify. It's been in use since 2010.

This was created this for those who want to write unit tests, but who don't want to pull in large
dependencies with functionality beyond what they need. For example, as of Nov 2023:

| Lib        | Source files | Lines of code |
| :--------- | -----------: | ------------: |
| Shoulda.js | 1            | 250           |
| Jest       | 539          | 52,096        |
| Mocha      | 77           | 8,206         |
| Jasmine    | 130          | 8,902         |

Where the metrics "source files" and "lines of code" exclude comments, documentation, and tests.

## Example usage

In Shoulda.js, tests are grouped into related units called contexts. Contexts can optionally include
setup code which is run before every test within that context.

Usage in Deno:

    deno add jsr:@philc/shoulda

Then, in a file named e.g. `mario_test.js`:

    import * as shoulda from "@philc/shoulda";
    const { assert, context, setup, should, teardown } = shoulda;

    context("Super mario", () => {
      let game;

      setup(() => {
        game = new MarioGame();
      });

      context("enemy interaction", () => {
        let enemy;

        setup(() => {
          enemy = game.addEnemy({ x: 10, y: 0 });
        });

        should("kill the enemy after jumping on it", () => {
          game.mario.jump({ x: 10, y: 0 });
          assert.equal("dead", enemy.state);
        });

        should("end the game if mario walks into an enemy", () => {
          game.mario.move({ x: 10, y: 0 });
          assert.equal("gameOver", game.state);
        });
      });
    });

Run it with shoulda's test runner; see [Running test files](#running-test-files).

Usage in Node.js:

    npm install --save-dev shoulda.js

Then, in a file named e.g. `mario_test.js`:

    import * as shoulda from "shoulda.js";
    ...

Run it with shoulda's test runner; see [Running test files](#running-test-files).

Usage in the browser:

    import * as shoulda from "./shoulda.js";
    // Write the tests.
    ...

    // Run the tests.
    await shoulda.run();

## Running test files

Shoulda's test runner finds every file named `*_test.js` or `*.test.js` in the current directory and
runs them.

**In Deno**

Add shoulda's test runner as a task in `deno.json`:

    "tasks": {
      "test": "deno run -A @philc/shoulda/run"
    }

`@philc/shoulda` resolves through the entry `deno add` put in `deno.json`, so the runner and your
tests use the same version of shoulda.

Then:

    # Run every file named *_test.js or *.test.js
    deno task test

    # Run only the tests in "exampleDir" whose names include "example test"
    deno task test exampleDir --filter "example test"

**In Node.js**

Add shoulda's test runner as a script in `package.json`:

    "scripts": {
      "test": "shoulda"
    }

Then:

    # Run every file named *_test.js or *.test.js
    npm test

    # Run only the tests in "exampleDir" whose names include "example test"
    npm test -- exampleDir --filter "example test"

## Assertions

These assertions are available on `assert`:

* `isTrue`
* `isFalse`
* `equal`
* `throwsError(fn, errorName)`
* `fail`

## Stubs

Stubbing allows you to temporarily redefine functions on objects for the duration of your test. This
is commonly used to do things like replace a network call and hard-code its return value. The syntax
is:

    const fakeElement = { id: "abc" };
    // returns(v) creates a function which, when called, returns `v`.
    shoulda.stub(document, "getElementById", returns(fakeElement));

How to stub a property:

    shoulda.stub(window.location, "href", "http://example.com");

## Tips

* When calling `shoulda.run()` yourself, pass it a string to run only the tests whose names include
  that string: `shoulda.run("enemy interaction")`.

* Alternatively, you can use `should.only` or `context.only` when defining tests. When one or more
  tests are defined using `should.only`, `shoulda.run()` will run only those tests.

## Changelog

* v2.1 (2026-11-09)
  * Add a test runner, `jsr:@philc/shoulda/run` in Deno and the `shoulda` command in Node.js, which
    finds and runs test files.
  * `shoulda.run()` fails when no tests have been defined.
  * The npm package is an ES module only. CommonJS code can still `require()` it in Node.js 23+.
* v2.0 (2023-10-30)
  * Update the test syntax to use closures rather than arrays. This allows for more flexibility, is
    easier for code editors to indent, and matches the syntax used by most JS testing libraries.
  * In test failure output, print complex objects on separate lines to improve readability.
  * Add "should.only" and "context.only" for programmatically limiting which tests will be run.
* v1.0 (2013-03-02)

## License

Licensed under the [MIT license](./LICENSE).
