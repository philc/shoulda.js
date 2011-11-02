Shoulda.js
=========

Shoulda.js is a micro JavaScript unit testing framework inspired by Shoulda for Ruby. It gives you a tight syntax for writing terse, readable unit tests. It weighs in at under 300 lines and makes no assumptions about your JavaScript environment or libraries.

Example usage
-------------
Shoulda.js provides a DSL for you to grouping tests into logical units called "contexts". Contexts can optionally share test-case setup code:

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
        }),

        should("end the game if mario walks into an enemy turtle", function() {
          game.mario.move({ x: 10, y: 0 });
          assert.equal("gameOver", game.state);
        })
      )
    );

    Tests.run();

That's it. To see the other available assertions, just glance through the source.

Stubs
-----
Stubbing means to replace methods that you want to control for the duration of your test. You'll often want to stub out expensive methods like talking to the network, or methods which would make your test easier to write. Shoulda provides a simple way to stub out properties and methods:

    stub(document, "getElementById", function(id) { assert.equal(id, "marioCharacter"); });
    or
    stub(document, "getElementById", returns(myElement));

Tips
----
- Calling Tests.run() with a String argument will only run a subset of your tests, e.g. Tests.run("kill the turtle")

- [Chrome's v8 JavaScript engine](http://code.google.com/apis/v8/intro.html) is a JavaScript interpreter that you can use to script and run your unit tests from the command line, outside of the browser.

- [envjs](http://www.envjs.com/) is a set of JavaScript files which provide a simulated browser environment. You can use envjs to run JavaScript tests at the webpage level with DOM interaction, but without having to launch an actual browser.

- You can customize how test status is reported by replacing the Tests.outputMethod property with your own function. By default, shoulda.js will use console.log in a browser and the global print() function in command line JavaScript shells like V8.

Contributing
------------
Contributors are welcome! Feel free to ping me with ideas for enhancements.

A short guide or tutorial on how to do command-line unit testing in JavaScript using shoulda.js would be great in helping folks get started.

License
-------
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
