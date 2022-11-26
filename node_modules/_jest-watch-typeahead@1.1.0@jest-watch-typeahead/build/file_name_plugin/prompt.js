import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import stringLength from 'string-length';
import { PatternPrompt, printPatternCaret, printRestoredPatternCaret } from 'jest-watcher';
import { escapeStrForRegex } from 'jest-regex-util';
import { highlight, getTerminalWidth, trimAndFormatPath, removeTrimmingDots } from "../lib/utils.js";
import { formatTypeaheadSelection, printMore, printPatternMatches, printStartTyping, printTypeaheadItem } from "../lib/pattern_mode_helpers.js";
import scroll from "../lib/scroll.js";
export default class FileNamePatternPrompt extends PatternPrompt {
  constructor(pipe, prompt) {
    super(pipe, prompt);
    this._entityName = 'filenames';
    this._searchSources = [];
  }

  _onChange(pattern, options) {
    super._onChange(pattern, options);

    this._printTypeahead(pattern, options);
  }

  _printTypeahead(pattern, options) {
    const matchedTests = this._getMatchedTests(pattern);

    const total = matchedTests.length;
    const pipe = this._pipe;
    const prompt = this._prompt;
    printPatternCaret(pattern, pipe);
    pipe.write(ansiEscapes.cursorLeft);

    if (pattern) {
      printPatternMatches(total, 'file', pipe);
      const prefix = `  ${chalk.dim('\u203A')} `;
      const padding = stringLength(prefix) + 2;
      const width = getTerminalWidth(pipe);
      const {
        start,
        end,
        index
      } = scroll(total, options);
      prompt.setPromptLength(total);
      matchedTests.slice(start, end).map(({
        path,
        context
      }) => {
        const filePath = trimAndFormatPath(padding, context.config, path, width);
        return highlight(path, filePath, pattern);
      }).map((item, i) => formatTypeaheadSelection(item, i, index, prompt)).forEach(item => printTypeaheadItem(item, pipe));

      if (total > end) {
        printMore('file', pipe, total - end);
      }
    } else {
      printStartTyping('filename', pipe);
    }

    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  _getMatchedTests(pattern) {
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {
      return [];
    }

    return this._searchSources.reduce((tests, {
      testPaths,
      config
    }) => {
      return tests.concat(testPaths.filter(testPath => regex.test(testPath)).map(path => ({
        path,
        context: {
          config
        }
      })));
    }, []);
  }

  updateSearchSources(searchSources) {
    this._searchSources = searchSources;
  }

  run(onSuccess, onCancel, options) {
    super.run(value => {
      onSuccess(removeTrimmingDots(value).split('/').map(escapeStrForRegex).join('/'));
    }, onCancel, options);
  }

}