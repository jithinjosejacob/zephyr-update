const axios = require("axios");

const fs = require("fs");
const crypto = require("crypto");

const configs = JSON.parse(
  fs.readFileSync("./zephyr.config.json", "utf8").toString()
);

async function createTestCycle(testCycleName) {
  try {
    const body = {
      name: testCycleName + crypto.randomUUID().toString().slice(0, 3),
      projectKey: configs.projectKey,
    };

    const uri = `${configs.endpoint}testcycles`;

    const headers = {
      Authorization: `Bearer ${configs.jwtToken}`,
    };
    let result = await axios.post(uri, body, { headers });

    return result.data.key;
  } catch (err) {
    console.log(err);
  }
}

async function getTestExecutionsFromJson(testCycleKey) {
  let json = JSON.parse(
    fs.readFileSync("./test-results.json", "utf8").toString()
  );
  let testExecutions = [];
  let suites = json.suites[0].suites[0];
  for (let test of suites.specs) {
    testExecutions.push({
      testCaseKey: await getTestCaseKey(test.title),
      statusName: test.ok ? "Pass" : "Fail",
      projectKey: configs.projectKey,
      testCycleKey: testCycleKey 

    });
  }
  return testExecutions;
}

async function getTestCaseKey(testName) {
  try {
    const uri = `${configs.endpoint}testcases`;
    const headers = {    
      Authorization: `Bearer ${configs.jwtToken}`,
    };

    let result = await axios.get(uri, { headers });
    return result.data.values.find((test) => test.name === testName).key;  
   }
    catch (err) {
      console.log(err);
    }   
}

async function createTestExecution(testExecution) {
  try {
    const uri = `${configs.endpoint}testexecutions`;
    const headers = {
      Authorization: `Bearer ${configs.jwtToken}`,
    };

    let result = await axios.post(uri, testExecution, { headers });
    return result.data;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createTestCycle, getTestExecutionsFromJson, getTestCaseKey ,createTestExecution };
