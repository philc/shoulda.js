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
