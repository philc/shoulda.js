Shoulda.js
==========
Shoulda.js is a micro JavaScript unit testing framework. It gives you a tight syntax for writing terse,
readable unit tests. It weighs in at under 350 lines and makes no assumptions about your JavaScript
environment or libraries.

Example usage
-------------
In Shoulda.js, tests are grouped into related units called "contexts". Contexts can optionally share setup
code which is common to all tests within that context:

    import * as shoulda from "shoulda.js";
    const {assert, context, setup, should, teardown} = shoulda;

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

That's it. To see the other available assertions, just glance through the source.

Stubs
-----
Stubbing means to temporarily redefine functions on objects for the duration of your test. This is commonly
used to do things like replace a network call and hard-code its return value. Here's the syntax:

    const fakeElement = { id: "abc" };
    shoulda.stub(document, "getElementById", returns(fakeElement));

How to stub a property:

    shoulda.stub(window.location, "href", "http://example.com");

Tips
----

* Calling `shoulda.run()` with a String argument will only run a subset of your tests, e.g.
  `shoulda.run("enemy interaction")`

* Alternatively, you can use `should.only` or `context.only` when defining a test. When one or more
  tests are defined using `should.only`, `shoula.run()` will run only those tests.

* You can customize how test status is reported by replacing the Tests.outputMethod property with your own
  function. By default, shoulda.js will use console.log in a browser and the global print() function in
  command line JavaScript shells like V8.

Changelog
---------
* v2.0 (work in progress)
  * Update the test syntax to use closures rather than arrays. This allows for more flexibility, is easier for
    code editors to indent, and matches the syntax used by most JS testing libraries.
  * In test failure output, print complex objects on separate lines to improve readability.
  * Add "should.only" and "context.only" for programmatically limiting which tests will be run.
* v1.0 (2013-03-02)

License
-------
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
