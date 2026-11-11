import * as shoulda from "./shoulda.js";
const { assert, context, setup, should, teardown } = shoulda;

shoulda.reset();

const order = [];
context("fixture: evaluation order", () => {
  setup(() => order.push("outer-setup"));
  context("C1 sub context", () => {
    setup(() => order.push("inner-setup"));
    should("should-1", () => order.push("should-1"));
  });
  should("should-2", () => order.push("should-2"));
  teardown(() => order.push("outer-teardown"));
});

context("evaluation order", () => {
  should("execute the collection phase in the correct order", () => {
    assert.equal([
      "outer-setup",
      "inner-setup",
      "should-1",
      "outer-teardown",
      "outer-setup",
      "should-2",
      "outer-teardown",
    ], order);
  });
});

context("state is passed to tests", () => {
  setup((t) => t.state = 123);

  should("have access to state", (t) => {
    assert.equal(123, t.state);
  });

  teardown((t) => assert.equal(123, t.state));
});

const teardownInfo = [];
context("fixture: teardown receives test info", () => {
  should("pass", () => {});
  teardown((_t, testInfo) => teardownInfo.push(structuredClone(testInfo)));
});

context("teardown", () => {
  should("receive the test's name and no errors when the test passed", () => {
    assert.equal(
      [{ name: "fixture: teardown receives test info: pass", errors: [] }],
      teardownInfo,
    );
  });
});

context("assertions", () => {
  should("succeed when the condition is true", () => {
    assert.isTrue(true);
    assert.isFalse(false);
    assert.equal(1, 1);
    assert.equal([1], [1]);
  });

  context("ensureCalled", () => {
    should("ensureCalled should not fail if called", () => {
      const f = shoulda.ensureCalled();
      f();
    });
  });

  context("throwsError", () => {
    should("catch error and pass the test", () => {
      assert.throwsError(() => {
        throw new Error("This should be caught.");
      }, "Error");
    });
  });
});

const StubFixture = { a: 1 };
context("stubs", () => {
  should("stub out properties of objects", () => {
    assert.equal(1, StubFixture.a);
    shoulda.stub(StubFixture, "a", 2);
    assert.equal(2, StubFixture.a);
  });
});

if (!(await shoulda.run())) {
  throw new Error("First group of tests failed.");
}
shoulda.reset();

// Running when no tests have been defined should fail.
if (await shoulda.run()) {
  throw new Error("run() should fail when no tests have been defined.");
}

// Teardown methods should see a failed test's errors.
let failedTestInfo;
context("teardown of a failing test", () => {
  should("fail", () => {
    throw new Error("Expected failure.");
  });
  teardown((_t, testInfo) => failedTestInfo = testInfo);
});
// Silence the failure output from this deliberately failing test.
const originalLog = console.log;
console.log = () => {};
const failingRunResult = await shoulda.run();
console.log = originalLog;
shoulda.reset();
if (failingRunResult) {
  throw new Error("run() should fail when a test throws.");
}

context("teardown", () => {
  should("receive the errors of a failed test", () => {
    assert.equal("teardown of a failing test: fail", failedTestInfo.name);
    assert.equal(1, failedTestInfo.errors.length);
    assert.equal("Expected failure.", failedTestInfo.errors[0].message);
  });
});

if (!(await shoulda.run())) {
  throw new Error("Teardown tests failed.");
}
shoulda.reset();

const testsRan = [];
context("skipping tests", () => {
  should.only("run A", () => testsRan.push("A"));
  context.only("run this whole context", () => {
    should("run B", () => testsRan.push("B"));
  });
  should("not run C", () => testsRan.push("C"));
  should.only("run D", () => testsRan.push("D"));
});

await shoulda.run();
shoulda.reset();

context("skipping tests", () => {
  should("have only run tests marked as only", () => {
    assert.equal(["A", "B", "D"], testsRan);
  });
});

await shoulda.run();
