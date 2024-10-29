const utils = require("./utils/index.js");
const fs = require("fs");
const configs = JSON.parse(
  fs.readFileSync("./zephyr.config.json", "utf8").toString()
);

async function main() {
  let testCycleKey = await utils.createTestCycle(configs.testCyclePrefix);
  let testExecutions = await utils.getTestExecutionsFromJson(testCycleKey);
  console.log(testExecutions);
  for (let test of testExecutions) {
    let res = await utils.createTestExecution(test);
    console.log(res);
  }

}

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
