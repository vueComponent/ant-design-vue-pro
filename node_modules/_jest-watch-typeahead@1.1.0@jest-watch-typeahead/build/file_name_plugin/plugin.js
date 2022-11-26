import { Prompt } from 'jest-watcher';
import FileNamePatternPrompt from "./prompt.js";
export default class FileNamePlugin {
  constructor({
    stdin,
    stdout,
    config = {}
  }) {
    this._stdin = stdin;
    this._stdout = stdout;
    this._prompt = new Prompt();
    this._projects = [];
    this._usageInfo = {
      key: config.key || 'p',
      prompt: config.prompt || 'filter by a filename regex pattern'
    };
  }

  apply(jestHooks) {
    jestHooks.onFileChange(({
      projects
    }) => {
      this._projects = projects;
    });
  }

  onKey(key) {
    this._prompt.put(key);
  }

  run(globalConfig, updateConfigAndRun) {
    const p = new FileNamePatternPrompt(this._stdout, this._prompt);
    p.updateSearchSources(this._projects);
    return new Promise((res, rej) => {
      p.run(testPathPattern => {
        updateConfigAndRun({
          mode: 'watch',
          testPathPattern
        });
        res();
      }, rej);
    });
  }

  getUsageInfo() {
    return this._usageInfo;
  }

}