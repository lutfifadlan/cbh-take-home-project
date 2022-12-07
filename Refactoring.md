# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

### Explanation of why I made the choices
- ```
const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
```
  Usually constant variables written at the very top so that we can easily see the what's the value of that while we code in the file and need to use that variable
- Remove ```data = JSON.stringify(event)``` to save variable (save memory)
- Use ternary operator to save some lines and make it more readable
- 
  ```if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }```

  We can just return the `TRIVIAL_PARTITION_KEY` if the event doesn't exists because that what happend if the candidate is undefined (which in this case if the event is undefined, candidate must be undefined)
- Combine the conditional statemens between if the event exists and not to save some lines of code
- No need to have ```if (candidate)``` logic because it's guaranteed that the candidate must be defined
- Move ```if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }``` to the conditional statement where the candidate is defined because if candidate is undefined that logic would never be touched
- Move ``` return candidate;``` up so that the function return the candidate value right away when it can be returned in that line


### Why more readable
It is more readable because
- The logics are easier to understand
- More straight forward
- It has less `if else` conditional statement
- Use less variables
