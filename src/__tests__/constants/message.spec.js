const MESSAGES = require("../../constants/messages");

describe("messages", function () {
  test("check if returns a valid object", function () {
    expect(Object.keys(MESSAGES).length).not.toBe(0);
    for (key in MESSAGES) {
      expect(MESSAGES[key]).not.toBe("");
    }
  });
});
