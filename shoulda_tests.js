const shoulda = require("./shoulda.js");
const {should, context, assert, setup, tearDown, ensureCalled, stub, Tests} = shoulda;

const resetState = () => {
  shoulda.Tests.topLevelContexts = [];
  shoulda.Tests.focusedTests = [];
  shoulda.Tests.focusIsUsed = false;
};
resetState();

const order = [];
context("fixture: evaluation order", () => {
  setup(() => order.push("outer-setup"));
  context("C1 sub context", () => {
    setup(() => order.push("inner-setup"));
    should("should-1", () => order.push("should-1"));
  });
  should("should-2", () => order.push("should-2"));
  tearDown(() => order.push("outer-teardown"));
});

context("evaluation order", () => {
  should("execute the collection phase in the correct order", () => {
    assert.equal(["outer-setup", "inner-setup", "should-1", "outer-teardown",
                  "outer-setup", "should-2", "outer-teardown"],
                 order);
  });
});

context("state is passed to tests", () => {
  setup((t) => t.state = 123);

  should("have access to state", (t) => {
    assert.equal(123, t.state);
  });

  tearDown((t) => assert.equal(123, t.state));
});

context("ensureCalled", () => {
  should("not fail if called", (t) => {
    const f = ensureCalled();
    f();
  });
});

StubFixture = {a: 1};
context("stubs", () => {
  should("stub out properties of objects", () => {
    assert.equal(1, StubFixture.a);
    stub(StubFixture, "a", 2);
    assert.equal(2, StubFixture.a);
  });
});

if (!shoulda.Tests.run())
  return;
resetState();

const testsRan = [];
context("skipping tests", () => {
  should.only("run A", () => testsRan.push("A"));
  context.only("run this whole context", () => {
    should("run B", () => testsRan.push("B"));
  });
  should("not run C", () => testsRan.push("C"));
  should.only("run D", () => testsRan.push("D"));
});

shoulda.Tests.run();
resetState();

context("skipping tests", () => {
  should("have only run tests marked as only", () => {
    assert.equal(["A", "B", "D"], testsRan);
  });
});

shoulda.Tests.run();
