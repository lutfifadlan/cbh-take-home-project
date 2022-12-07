const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  let candidate;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  } else {
    candidate = event.partitionKey ? event.partitionKey : crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")

    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      return crypto.createHash("sha3-512").update(candidate).digest("hex");
    } else {
      return candidate;
    }
  }
};