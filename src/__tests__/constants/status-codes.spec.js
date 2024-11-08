const STATUS_CODES = require("../../constants/status-codes");

describe("status-codes", function () {
  test("check if returns a valid object", function () {
    expect(Object.keys(STATUS_CODES).length).not.toBe(0);
  });
});
