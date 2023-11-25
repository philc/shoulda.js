Shoulda.js
==========
Shoulda.js is a JavaScript unit testing micro framework. It provides syntax for writing terse,
readable tests. It makes no assumptions about your JavaScript environment or libraries. At about 280
lines of code, it's easy to understand and modify It's been in use since 2010.

This was created this for those who want to write unit tests, but who don't want to pull in large
dependencies with functionality beyond what they need. For example, as of Nov 2023:

| Lib        | Source files | Lines of code |
| :--------- | -----------: | ------------: |
| Shoulda.js | 1            | 250           |
| Jest       | 539          | 52,096        |
| Mocha      | 77           | 8,206         |
| Jasmine    | 130          | 8,902         |

Where the metrics "source files" and "lines of code" exclude comments, documentation, and tests.

Example usage
-------------
In Shoulda.js, tests are grouped into related units called "contexts". Contexts can optionally share
setup code which is common to all tests within that context.

Usage in Deno:

    import * as shoulda from "https://deno.land/x/shoulda/shoulda.js";
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

    await shoulda.run();

Usage in Node.js:

    npm install --save-dev shoulda.js

    const shoulda = require("shoulda.js");
    ...

Usage in the browser:

    import * as shoulda from "./shoulda.js";
    ...

Assertions
----------

These assertions are available on `assert`:

* `isTrue`
* `isFalse`
* `equal`
* `throwsError(fn, errorName)`
* `fail`

Stubs
-----
Stubbing means to temporarily redefine functions on objects for the duration of your test. This is
commonly used to do things like replace a network call and hard-code its return value. The syntax
is:

    const fakeElement = { id: "abc" };
    // returns(v) creates a function which, when called, returns `v`.
    shoulda.stub(document, "getElementById", returns(fakeElement));

How to stub a property:

    shoulda.stub(window.location, "href", "http://example.com");

Tips
----
* Calling `shoulda.run()` with a String argument will only run a subset of the tests:
  `shoulda.run("enemy interaction")`

* Alternatively, you can use `should.only` or `context.only` when defining tests. When one or more
  tests are defined using `should.only`, `shoulda.run()` will run only those tests.

Changelog
---------
* v2.0 (2023-10-30)
  * Update the test syntax to use closures rather than arrays. This allows for more flexibility, is
    easier for code editors to indent, and matches the syntax used by most JS testing libraries.
  * In test failure output, print complex objects on separate lines to improve readability.
  * Add "should.only" and "context.only" for programmatically limiting which tests will be run.
* v1.0 (2013-03-02)

License
-------
Licensed under the [MIT license](./LICENSE).
