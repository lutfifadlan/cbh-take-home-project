const {deterministicPartitionKey} = require("./dpk");

console.log(deterministicPartitionKey("test"));

console.log(deterministicPartitionKey({
  partitionKey: "mantap"
}));