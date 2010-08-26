Shouda.js
=========

Shoulda.js is a micro javascript unit testing framework inspired by Ruby's Shoulda framework. It gives you a tight syntax for writing terse, readable unit tests.

Example usage
-------------
Shoulda.js can make use of context blocks. Contexts are a way for you to group tests together into logical units, and optionally share test-case setup code.

    context("super mario",
      setup(function() {
        game = new SuperMarioGame();
      }),

      context("enemy interaction",
        setup(function() {
          turtle = game.addTurtleEnemy({ x: 10, y: 0 });
        }),
        
        should("kill the turtle after jumping on it", function() {
          game.mario.jump({ x: 10, y: 0 });
          assert.equal("dead", turtle.state);
        })

        should("end the game if mario walks into an enemy turtle", function() {
          game.mario.move({ x: 10, y: 0 });
          assert.equal("gameOver", game.state);
        })
      )
    );

    Tests.run();

That's it. The test results are logged using console.log(). To see the rest of the available assertions, just glance through the source.

Stubs
-----
Stubbing means to replace methods that you want to control in your test. You'll often want to stub out expensive methods like talking to the network, or methods which would make your test easier to write. Shoulda provides a simple way to stub out methods:

    stub(document, "getElementById", function(id) { assert.equal(id, "marioCharacter"); });
    or
    stub(document, "getElementById", returns(myElement));

Tips
----
- Calling Tests.run() with a String argument will only run a subset of your tests, e.g. Tests.run("kill the turtle")

- [Chrome's v8 javascript engine](http://code.google.com/apis/v8/intro.html) is a JavaScript interpreter that you can use to script and run your unit tests from the command line, outside of the browser.

- [envjs](http://www.envjs.com/) is a set of javascript files which provide a simulated browser environment. You can use envjs to run javascript tests at the webpage level with DOM interaction, but without having to run an actual browser.

Contributing
------------
Contributors are welcome! Feel free to ping me with ideas for enhancements.

License
-------
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).