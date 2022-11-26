import { Prompt } from 'jest-watcher';
import TestNamePatternPrompt from "./prompt.js";
export default class TestNamePlugin {
  constructor({
    stdin,
    stdout,
    config = {}
  }) {
    this._stdin = stdin;
    this._stdout = stdout;
    this._prompt = new Prompt();
    this._testResults = [];
    this._usageInfo = {
      key: config.key || 't',
      prompt: config.prompt || 'filter by a test name regex pattern'
    };
  }

  apply(jestHooks) {
    jestHooks.onTestRunComplete(({
      testResults
    }) => {
      this._testResults = testResults;
    });
  }

  onKey(key) {
    this._prompt.put(key);
  }

  run(globalConfig, updateConfigAndRun) {
    const p = new TestNamePatternPrompt(this._stdout, this._prompt);
    p.updateCachedTestResults(this._testResults);
    return new Promise((res, rej) => {
      p.run(testNamePattern => {
        updateConfigAndRun({
          mode: 'watch',
          testNamePattern
        });
        res();
      }, rej);
    });
  }

  getUsageInfo() {
    return this._usageInfo;
  }

}