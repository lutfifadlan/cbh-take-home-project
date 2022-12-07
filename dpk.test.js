const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns string when input is a string", () => {
    const trivialKey = deterministicPartitionKey("test");
    expect(trivialKey.length).toEqual(128);
  });

  it("Returns string when input is containing an object that has partitionKey field with string value", () => {
    const trivialKey = deterministicPartitionKey({
      partitionKey: "yes"
    });
    expect(trivialKey.length).toEqual(3);
  });

  it("Returns string when input is number test", () => {
    const trivialKey = deterministicPartitionKey(123455);
    expect(trivialKey.length).toEqual(128);
  });

  it("Returns string when input is containing an object that has partitionKey field with value isn't string", () => {
    const trivialKey = deterministicPartitionKey({
      partitionKey: 123
    });
    expect(trivialKey.length).toEqual(3);
  });
});
