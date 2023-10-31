Shoulda.js
==========
Shoulda.js is a micro JavaScript unit testing framework. It provides the syntax for writing terse,
readable unit tests. At under 360 lines of code, it's easy to understand and modify, and makes no
assumptions about your JavaScript environment or libraries.

Example usage
-------------
In Shoulda.js, tests are grouped into related units called "contexts". Contexts can optionally share
setup code which is common to all tests within that context:

    import * as shoulda from "shoulda.js";
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
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
