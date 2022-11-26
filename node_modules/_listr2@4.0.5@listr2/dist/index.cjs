var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Listr: () => Listr,
  ListrError: () => ListrError,
  ListrErrorTypes: () => ListrErrorTypes,
  ListrEventType: () => ListrEventType,
  ListrTaskState: () => ListrTaskState,
  LogLevels: () => LogLevels,
  Logger: () => Logger,
  Manager: () => Manager,
  PromptError: () => PromptError,
  createPrompt: () => createPrompt,
  destroyPrompt: () => destroyPrompt,
  figures: () => figures
});

// src/listr.ts
var import_p_map = __toESM(require("p-map"), 1);
var import_rxjs2 = require("rxjs");

// src/constants/state.constants.ts
var ListrTaskState = /* @__PURE__ */ ((ListrTaskState2) => {
  ListrTaskState2["PENDING"] = "PENDING";
  ListrTaskState2["COMPLETED"] = "COMPLETED";
  ListrTaskState2["FAILED"] = "FAILED";
  ListrTaskState2["SKIPPED"] = "SKIPPED";
  ListrTaskState2["ROLLING_BACK"] = "ROLLING_BACK";
  ListrTaskState2["ROLLED_BACK"] = "ROLLED_BACK";
  ListrTaskState2["RETRY"] = "RETRY";
  return ListrTaskState2;
})(ListrTaskState || {});

// src/lib/task.ts
var import_rxjs = require("rxjs");
var import_stream = require("stream");

// src/constants/event.constants.ts
var ListrEventType = /* @__PURE__ */ ((ListrEventType2) => {
  ListrEventType2["TITLE"] = "TITLE";
  ListrEventType2["STATE"] = "STATE";
  ListrEventType2["ENABLED"] = "ENABLED";
  ListrEventType2["SUBTASK"] = "SUBTASK";
  ListrEventType2["DATA"] = "DATA";
  ListrEventType2["MESSAGE"] = "MESSAGE";
  return ListrEventType2;
})(ListrEventType || {});

// src/utils/general.ts
var import_rfdc = __toESM(require("rfdc"), 1);
var clone = (0, import_rfdc.default)({ circles: true });
function cloneObject(obj) {
  return clone(obj);
}

// src/interfaces/listr-error.interface.ts
var ListrError = class extends Error {
  constructor(error, type, task) {
    super(error.message);
    this.error = error;
    this.type = type;
    this.task = task;
    var _a2;
    this.name = "ListrError";
    this.path = [...(_a2 = task.listr.path) != null ? _a2 : [], task.title].join(" > ");
    if ((task == null ? void 0 : task.options.collectErrors) === "full") {
      this.task = cloneObject(task);
      this.ctx = cloneObject(task.listr.ctx);
    }
    this.stack = error == null ? void 0 : error.stack;
  }
};
var ListrErrorTypes = /* @__PURE__ */ ((ListrErrorTypes2) => {
  ListrErrorTypes2["WILL_RETRY"] = "WILL_RETRY";
  ListrErrorTypes2["WILL_ROLLBACK"] = "WILL_ROLLBACK";
  ListrErrorTypes2["HAS_FAILED_TO_ROLLBACK"] = "HAS_FAILED_TO_ROLLBACK";
  ListrErrorTypes2["HAS_FAILED"] = "HAS_FAILED";
  ListrErrorTypes2["HAS_FAILED_WITHOUT_ERROR"] = "HAS_FAILED_WITHOUT_ERROR";
  return ListrErrorTypes2;
})(ListrErrorTypes || {});
var PromptError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PromptError";
  }
};

// src/utils/assert.ts
function assertFunctionOrSelf(functionOrSelf, ...args) {
  if (typeof functionOrSelf === "function") {
    return functionOrSelf(...args);
  } else {
    return functionOrSelf;
  }
}

// src/renderer/default.renderer.ts
var import_cli_truncate = __toESM(require("cli-truncate"), 1);
var import_log_update = __toESM(require("log-update"), 1);
var import_os = require("os");
var import_wrap_ansi = __toESM(require("wrap-ansi"), 1);

// src/utils/colorette.ts
var import_colorette = require("colorette");
var _a;
var colorette_default = (0, import_colorette.createColors)({ useColor: ((_a = process.env) == null ? void 0 : _a.LISTR_DISABLE_COLOR) !== "1" });

// src/utils/is-unicode-supported.ts
function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return true;
  }
  return Boolean(process.env.CI) || Boolean(process.env.WT_SESSION) || process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty";
}

// src/utils/figures.ts
var FIGURES_MAIN = {
  warning: "\u26A0",
  cross: "\u2716",
  arrowDown: "\u2193",
  tick: "\u2714",
  arrowRight: "\u2192",
  pointer: "\u276F",
  checkboxOn: "\u2612",
  arrowLeft: "\u2190",
  squareSmallFilled: "\u25FC",
  pointerSmall: "\u203A"
};
var FIGURES_FALLBACK = __spreadProps(__spreadValues({}, FIGURES_MAIN), {
  warning: "\u203C",
  cross: "\xD7",
  tick: "\u221A",
  pointer: ">",
  checkboxOn: "[\xD7]",
  squareSmallFilled: "\u25A0"
});
var figures = isUnicodeSupported() ? FIGURES_MAIN : FIGURES_FALLBACK;

// src/utils/indent-string.ts
function indentString(string, count) {
  return string.replace(/^(?!\s*$)/gm, " ".repeat(count));
}

// src/utils/parse-time.ts
function parseTaskTime(duration) {
  const seconds = Math.floor(duration / 1e3);
  const minutes = Math.floor(seconds / 60);
  let parsedTime;
  if (seconds === 0 && minutes === 0) {
    parsedTime = `0.${Math.floor(duration / 100)}s`;
  }
  if (seconds > 0) {
    parsedTime = `${seconds % 60}s`;
  }
  if (minutes > 0) {
    parsedTime = `${minutes}m${parsedTime}`;
  }
  return parsedTime;
}

// src/renderer/default.renderer.ts
var _DefaultRenderer = class {
  constructor(tasks, options, renderHook$) {
    this.tasks = tasks;
    this.options = options;
    this.renderHook$ = renderHook$;
    this.bottomBar = {};
    this.spinner = !isUnicodeSupported() ? ["-", "\\", "|", "/"] : ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
    this.spinnerPosition = 0;
    this.options = __spreadValues(__spreadValues({}, _DefaultRenderer.rendererOptions), this.options);
  }
  getTaskOptions(task) {
    return __spreadValues(__spreadValues({}, _DefaultRenderer.rendererTaskOptions), task.rendererTaskOptions);
  }
  isBottomBar(task) {
    const bottomBar = this.getTaskOptions(task).bottomBar;
    return typeof bottomBar === "number" && bottomBar !== 0 || typeof bottomBar === "boolean" && bottomBar !== false;
  }
  hasPersistentOutput(task) {
    return this.getTaskOptions(task).persistentOutput === true;
  }
  hasTimer(task) {
    return this.getTaskOptions(task).showTimer === true;
  }
  getSelfOrParentOption(task, key) {
    var _a2, _b, _c;
    return (_c = (_a2 = task == null ? void 0 : task.rendererOptions) == null ? void 0 : _a2[key]) != null ? _c : (_b = this.options) == null ? void 0 : _b[key];
  }
  getTaskTime(task) {
    return colorette_default.dim(`[${parseTaskTime(task.message.duration)}]`);
  }
  createRender(options) {
    options = __spreadValues(__spreadValues({}, {
      tasks: true,
      bottomBar: true,
      prompt: true
    }), options);
    const render = [];
    const renderTasks = this.multiLineRenderer(this.tasks);
    const renderBottomBar = this.renderBottomBar();
    const renderPrompt = this.renderPrompt();
    if (options.tasks && (renderTasks == null ? void 0 : renderTasks.trim().length) > 0) {
      render.push(renderTasks);
    }
    if (options.bottomBar && (renderBottomBar == null ? void 0 : renderBottomBar.trim().length) > 0) {
      render.push((render.length > 0 ? import_os.EOL : "") + renderBottomBar);
    }
    if (options.prompt && (renderPrompt == null ? void 0 : renderPrompt.trim().length) > 0) {
      render.push((render.length > 0 ? import_os.EOL : "") + renderPrompt);
    }
    return render.length > 0 ? render.join(import_os.EOL) : "";
  }
  render() {
    var _a2;
    if (this.id) {
      return;
    }
    const updateRender = () => (0, import_log_update.default)(this.createRender());
    if (!((_a2 = this.options) == null ? void 0 : _a2.lazy)) {
      this.id = setInterval(() => {
        this.spinnerPosition = ++this.spinnerPosition % this.spinner.length;
        updateRender();
      }, 100);
    }
    this.renderHook$.subscribe(() => {
      updateRender();
    });
  }
  end() {
    clearInterval(this.id);
    if (this.id) {
      this.id = void 0;
    }
    import_log_update.default.clear();
    import_log_update.default.done();
    if (!this.options.clearOutput) {
      process.stdout.write(this.createRender({ prompt: false }) + import_os.EOL);
    }
  }
  multiLineRenderer(tasks, level = 0) {
    var _a2, _b;
    let output = [];
    for (const task of tasks) {
      if (task.isEnabled()) {
        if (task.hasTitle()) {
          if (!(tasks.some((task2) => task2.hasFailed()) && !task.hasFailed() && task.options.exitOnError !== false && !(task.isCompleted() || task.isSkipped()))) {
            if (task.hasFailed() && this.getSelfOrParentOption(task, "collapseErrors")) {
              output = [
                ...output,
                this.formatString(!task.hasSubtasks() && task.message.error && this.getSelfOrParentOption(task, "showErrorMessage") ? task.message.error : task.title, this.getSymbol(task), level)
              ];
            } else if (task.isSkipped() && this.getSelfOrParentOption(task, "collapseSkips")) {
              output = [
                ...output,
                this.formatString(this.addSuffixToMessage(task.message.skip && this.getSelfOrParentOption(task, "showSkipMessage") ? task.message.skip : task.title, "SKIPPED", this.getSelfOrParentOption(task, "suffixSkips")), this.getSymbol(task), level)
              ];
            } else if (task.isRetrying() && this.getSelfOrParentOption(task, "suffixRetries")) {
              output = [...output, this.formatString(this.addSuffixToMessage(task.title, `RETRYING-${task.message.retry.count}`), this.getSymbol(task), level)];
            } else if (task.isCompleted() && task.hasTitle() && (this.getSelfOrParentOption(task, "showTimer") || this.hasTimer(task))) {
              output = [...output, this.formatString(`${task == null ? void 0 : task.title} ${this.getTaskTime(task)}`, this.getSymbol(task), level)];
            } else {
              output = [...output, this.formatString(task.title, this.getSymbol(task), level)];
            }
          } else {
            output = [...output, this.formatString(task.title, colorette_default.red(figures.squareSmallFilled), level)];
          }
        }
        if (!task.hasSubtasks() || !this.getSelfOrParentOption(task, "showSubtasks")) {
          if (task.hasFailed() && this.getSelfOrParentOption(task, "collapseErrors") === false && (this.getSelfOrParentOption(task, "showErrorMessage") || !this.getSelfOrParentOption(task, "showSubtasks"))) {
            output = [...output, this.dumpData(task, level, "error")];
          } else if (task.isSkipped() && this.getSelfOrParentOption(task, "collapseSkips") === false && (this.getSelfOrParentOption(task, "showSkipMessage") || !this.getSelfOrParentOption(task, "showSubtasks"))) {
            output = [...output, this.dumpData(task, level, "skip")];
          }
        }
        if (task == null ? void 0 : task.output) {
          if ((task.isPending() || task.isRetrying() || task.isRollingBack()) && task.isPrompt()) {
            this.promptBar = task.output;
          } else if (this.isBottomBar(task) || !task.hasTitle()) {
            const data = [this.dumpData(task, -1)];
            if (!this.bottomBar[task.id]) {
              this.bottomBar[task.id] = {};
              this.bottomBar[task.id].data = [];
              const bottomBar = this.getTaskOptions(task).bottomBar;
              if (typeof bottomBar === "boolean") {
                this.bottomBar[task.id].items = 1;
              } else {
                this.bottomBar[task.id].items = bottomBar;
              }
            }
            if (!((_b = (_a2 = this.bottomBar[task.id]) == null ? void 0 : _a2.data) == null ? void 0 : _b.some((element) => data.includes(element))) && !task.isSkipped()) {
              this.bottomBar[task.id].data = [...this.bottomBar[task.id].data, ...data];
            }
          } else if (task.isPending() || task.isRetrying() || task.isRollingBack() || this.hasPersistentOutput(task)) {
            output = [...output, this.dumpData(task, level)];
          }
        }
        if (this.getSelfOrParentOption(task, "showSubtasks") !== false && task.hasSubtasks() && (task.isPending() || task.hasFailed() || task.isCompleted() && !task.hasTitle() || task.isCompleted() && this.getSelfOrParentOption(task, "collapse") === false && !task.subtasks.some((subtask) => subtask.rendererOptions.collapse === true) || task.subtasks.some((subtask) => subtask.rendererOptions.collapse === false) || task.subtasks.some((subtask) => subtask.hasFailed()) || task.subtasks.some((subtask) => subtask.hasRolledBack()))) {
          const subtaskLevel = !task.hasTitle() ? level : level + 1;
          const subtaskRender = this.multiLineRenderer(task.subtasks, subtaskLevel);
          if ((subtaskRender == null ? void 0 : subtaskRender.trim()) !== "" && !task.subtasks.every((subtask) => !subtask.hasTitle())) {
            output = [...output, subtaskRender];
          }
        }
        if (task.isCompleted() || task.hasFailed() || task.isSkipped() || task.hasRolledBack()) {
          this.promptBar = null;
          if (!this.hasPersistentOutput(task)) {
            delete this.bottomBar[task.id];
          }
        }
      }
    }
    output = output.filter(Boolean);
    if (output.length > 0) {
      return output.join(import_os.EOL);
    } else {
      return;
    }
  }
  renderBottomBar() {
    if (Object.keys(this.bottomBar).length > 0) {
      this.bottomBar = Object.keys(this.bottomBar).reduce((o, key) => {
        if (!(o == null ? void 0 : o[key])) {
          o[key] = {};
        }
        o[key] = this.bottomBar[key];
        this.bottomBar[key].data = this.bottomBar[key].data.slice(-this.bottomBar[key].items);
        o[key].data = this.bottomBar[key].data;
        return o;
      }, {});
      return Object.values(this.bottomBar).reduce((o, value) => o = [...o, ...value.data], []).filter(Boolean).join(import_os.EOL);
    }
  }
  renderPrompt() {
    if (this.promptBar) {
      return this.promptBar;
    }
  }
  dumpData(task, level, source = "output") {
    let data;
    switch (source) {
      case "output":
        data = task.output;
        break;
      case "skip":
        data = task.message.skip;
        break;
      case "error":
        data = task.message.error;
        break;
    }
    if (task.hasTitle() && source === "error" && data === task.title) {
      return;
    }
    if (typeof data === "string") {
      return this.formatString(data, this.getSymbol(task, true), level + 1);
    }
  }
  formatString(str, icon, level) {
    if (str.trim() === "") {
      return;
    }
    str = `${icon} ${str}`;
    let parsedStr;
    let columns = process.stdout.columns ? process.stdout.columns : 80;
    columns = columns - level * this.options.indentation - 2;
    switch (this.options.formatOutput) {
      case "truncate":
        parsedStr = str.split(import_os.EOL).map((s, i) => {
          return (0, import_cli_truncate.default)(this.indentMultilineOutput(s, i), columns);
        });
        break;
      case "wrap":
        parsedStr = (0, import_wrap_ansi.default)(str, columns, { hard: true }).split(import_os.EOL).map((s, i) => this.indentMultilineOutput(s, i));
        break;
      default:
        throw new Error("Format option for the renderer is wrong.");
    }
    if (this.options.removeEmptyLines) {
      parsedStr = parsedStr.filter(Boolean);
    }
    return indentString(parsedStr.join(import_os.EOL), level * this.options.indentation);
  }
  indentMultilineOutput(str, i) {
    return i > 0 ? indentString(str.trim(), 2) : str.trim();
  }
  getSymbol(task, data = false) {
    var _a2, _b, _c;
    if (task.isPending() && !data) {
      return ((_a2 = this.options) == null ? void 0 : _a2.lazy) || this.getSelfOrParentOption(task, "showSubtasks") !== false && task.hasSubtasks() && !task.subtasks.every((subtask) => !subtask.hasTitle()) ? colorette_default.yellow(figures.pointer) : colorette_default.yellowBright(this.spinner[this.spinnerPosition]);
    } else if (task.isCompleted() && !data) {
      return task.hasSubtasks() && task.subtasks.some((subtask) => subtask.hasFailed()) ? colorette_default.yellow(figures.warning) : colorette_default.green(figures.tick);
    } else if (task.isRetrying() && !data) {
      return ((_b = this.options) == null ? void 0 : _b.lazy) ? colorette_default.yellow(figures.warning) : colorette_default.yellow(this.spinner[this.spinnerPosition]);
    } else if (task.isRollingBack() && !data) {
      return ((_c = this.options) == null ? void 0 : _c.lazy) ? colorette_default.red(figures.warning) : colorette_default.red(this.spinner[this.spinnerPosition]);
    } else if (task.hasRolledBack() && !data) {
      return colorette_default.red(figures.arrowLeft);
    } else if (task.hasFailed() && !data) {
      return task.hasSubtasks() ? colorette_default.red(figures.pointer) : colorette_default.red(figures.cross);
    } else if (task.isSkipped() && !data && this.getSelfOrParentOption(task, "collapseSkips") === false) {
      return colorette_default.yellow(figures.warning);
    } else if (task.isSkipped() && (data || this.getSelfOrParentOption(task, "collapseSkips"))) {
      return colorette_default.yellow(figures.arrowDown);
    }
    return !data ? colorette_default.dim(figures.squareSmallFilled) : figures.pointerSmall;
  }
  addSuffixToMessage(message, suffix, condition) {
    return (condition != null ? condition : true) ? message + colorette_default.dim(` [${suffix}]`) : message;
  }
};
var DefaultRenderer = _DefaultRenderer;
DefaultRenderer.nonTTY = false;
DefaultRenderer.rendererOptions = {
  indentation: 2,
  clearOutput: false,
  showSubtasks: true,
  collapse: true,
  collapseSkips: true,
  showSkipMessage: true,
  suffixSkips: true,
  collapseErrors: true,
  showErrorMessage: true,
  suffixRetries: true,
  lazy: false,
  showTimer: false,
  removeEmptyLines: true,
  formatOutput: "truncate"
};

// src/renderer/silent.renderer.ts
var SilentRenderer = class {
  constructor(tasks, options) {
    this.tasks = tasks;
    this.options = options;
  }
  render() {
  }
  end() {
  }
};
SilentRenderer.nonTTY = true;

// src/renderer/simple.renderer.ts
var import_log_update2 = require("log-update");
var import_os2 = require("os");
var _SimpleRenderer = class {
  constructor(tasks, options) {
    this.tasks = tasks;
    this.options = options;
    this.eventTypeRendererMap = {
      ["SUBTASK" /* SUBTASK */]: (task) => {
        if (task.hasTitle()) {
          this.log(`${colorette_default.blue(figures.pointer)} ${task.title}`);
        }
        if (task.hasSubtasks()) {
          this.render(task.subtasks);
        }
      },
      ["STATE" /* STATE */]: (task) => {
        if (task.isCompleted() && task.hasTitle()) {
          this.log(`${colorette_default.green(figures.tick)} ${task.title}`);
        }
      },
      ["DATA" /* DATA */]: (task, event) => {
        if (task.isPrompt() && !String(event.data).match(/^\n$/)) {
          (0, import_log_update2.stderr)(`${event.data}`);
        } else {
          this.log(`${figures.pointerSmall} ${event.data}`);
        }
      },
      ["MESSAGE" /* MESSAGE */]: (task, event) => {
        if (event.data.error) {
          const title = _SimpleRenderer.formatTitle(task);
          this.log(`${colorette_default.red(figures.cross)}${title}: ${event.data.error}`);
        } else if (event.data.skip) {
          const title = _SimpleRenderer.formatTitle(task);
          const skip = task.title !== event.data.skip ? `: ${event.data.skip}` : "";
          this.log(`${colorette_default.yellow(figures.arrowDown)}${title} [${colorette_default.yellow(`skipped${skip}`)}]`);
        } else if (event.data.rollback) {
          const title = _SimpleRenderer.formatTitle(task);
          this.log(`${colorette_default.red(figures.arrowLeft)}${title}: ${event.data.rollback}`);
        } else if (event.data.retry) {
          const title = _SimpleRenderer.formatTitle(task);
          this.log(`[${colorette_default.yellow(`${event.data.retry.count}`)}]${title}`);
        }
      }
    };
    this.options = __spreadValues(__spreadValues({}, _SimpleRenderer.rendererOptions), options);
  }
  static now() {
    return new Date();
  }
  static formatTitle(task) {
    return (task == null ? void 0 : task.title) ? ` ${task.title}` : "";
  }
  log(output) {
    const logOut = (msg) => {
      process[this.options.output].write(msg.endsWith(import_os2.EOL) ? msg : `${msg}${import_os2.EOL}`);
    };
    if (!this.options.prefixWithTimestamp) {
      logOut(`${output}`);
      return;
    }
    const now = _SimpleRenderer.now();
    const timestamp = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
    logOut(`${colorette_default.dim(`[${timestamp}]`)} ${output}`);
  }
  end() {
  }
  render(tasks) {
    if (tasks == null ? void 0 : tasks.length) {
      tasks.forEach((task) => {
        task.subscribe((event) => {
          var _a2, _b;
          (_b = (_a2 = this.eventTypeRendererMap)[event.type]) == null ? void 0 : _b.call(_a2, task, event);
        }, this.log);
      });
    } else {
      this.render(this.tasks);
    }
  }
};
var SimpleRenderer = _SimpleRenderer;
SimpleRenderer.nonTTY = true;
SimpleRenderer.rendererOptions = { prefixWithTimestamp: false, output: "stdout" };

// src/utils/logger.constants.ts
var LogLevels = /* @__PURE__ */ ((LogLevels2) => {
  LogLevels2["SILENT"] = "SILENT";
  LogLevels2["FAILED"] = "FAILED";
  LogLevels2["SKIPPED"] = "SKIPPED";
  LogLevels2["SUCCESS"] = "SUCCESS";
  LogLevels2["DATA"] = "DATA";
  LogLevels2["STARTED"] = "STARTED";
  LogLevels2["TITLE"] = "TITLE";
  LogLevels2["RETRY"] = "RETRY";
  LogLevels2["ROLLBACK"] = "ROLLBACK";
  return LogLevels2;
})(LogLevels || {});

// src/utils/logger.ts
var Logger = class {
  constructor(options) {
    this.options = options;
  }
  fail(message) {
    message = this.parseMessage("FAILED" /* FAILED */, message);
    console.error(message);
  }
  skip(message) {
    message = this.parseMessage("SKIPPED" /* SKIPPED */, message);
    console.info(message);
  }
  success(message) {
    message = this.parseMessage("SUCCESS" /* SUCCESS */, message);
    console.log(message);
  }
  data(message) {
    message = this.parseMessage("DATA" /* DATA */, message);
    console.info(message);
  }
  start(message) {
    message = this.parseMessage("STARTED" /* STARTED */, message);
    console.log(message);
  }
  title(message) {
    message = this.parseMessage("TITLE" /* TITLE */, message);
    console.info(message);
  }
  retry(message) {
    message = this.parseMessage("RETRY" /* RETRY */, message);
    console.warn(message);
  }
  rollback(message) {
    message = this.parseMessage("ROLLBACK" /* ROLLBACK */, message);
    console.warn(message);
  }
  parseMessage(level, message) {
    let multiLineMessage;
    try {
      multiLineMessage = message.split("\n");
    } catch {
      multiLineMessage = [message];
    }
    multiLineMessage = multiLineMessage.map((msg) => {
      return this.logColoring({
        level,
        message: msg
      });
    });
    message = multiLineMessage.join("\n");
    return message;
  }
  logColoring({ level, message }) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let icon;
    let coloring = (input) => {
      return input;
    };
    switch (level) {
      case "FAILED" /* FAILED */:
        if ((_a2 = this.options) == null ? void 0 : _a2.useIcons) {
          coloring = colorette_default.red;
          icon = figures.cross;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "SKIPPED" /* SKIPPED */:
        if ((_b = this.options) == null ? void 0 : _b.useIcons) {
          coloring = colorette_default.yellow;
          icon = figures.arrowDown;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "SUCCESS" /* SUCCESS */:
        if ((_c = this.options) == null ? void 0 : _c.useIcons) {
          coloring = colorette_default.green;
          icon = figures.tick;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "DATA" /* DATA */:
        if ((_d = this.options) == null ? void 0 : _d.useIcons) {
          icon = figures.arrowRight;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "STARTED" /* STARTED */:
        if ((_e = this.options) == null ? void 0 : _e.useIcons) {
          icon = figures.pointer;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "TITLE" /* TITLE */:
        if ((_f = this.options) == null ? void 0 : _f.useIcons) {
          icon = figures.checkboxOn;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "RETRY" /* RETRY */:
        if ((_g = this.options) == null ? void 0 : _g.useIcons) {
          coloring = colorette_default.yellow;
          icon = figures.pointer;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
      case "ROLLBACK" /* ROLLBACK */:
        if ((_h = this.options) == null ? void 0 : _h.useIcons) {
          coloring = colorette_default.red;
          icon = figures.arrowLeft;
        } else {
          icon = this.wrapInBrackets(level);
        }
        break;
    }
    return coloring(`${icon} ${message}`);
  }
  wrapInBrackets(level) {
    return `[${level}]`;
  }
};

// src/renderer/verbose.renderer.ts
var _VerboseRenderer = class {
  constructor(tasks, options) {
    this.tasks = tasks;
    this.options = options;
    var _a2, _b, _c, _d;
    if (((_a2 = this.options) == null ? void 0 : _a2.logger) && ((_b = this.options) == null ? void 0 : _b.options)) {
      this.logger = new this.options.logger(this.options.options);
    } else if ((_c = this.options) == null ? void 0 : _c.logger) {
      this.logger = new this.options.logger();
    } else {
      this.logger = new Logger({ useIcons: (_d = this.options) == null ? void 0 : _d.useIcons });
    }
    this.options = __spreadValues(__spreadValues({}, _VerboseRenderer.rendererOptions), this.options);
  }
  render() {
    this.verboseRenderer(this.tasks);
  }
  end() {
  }
  verboseRenderer(tasks) {
    return tasks == null ? void 0 : tasks.forEach((task) => {
      task.subscribe((event) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h;
        if (task.isEnabled()) {
          const taskTitle = task.hasTitle() ? task.title : "Task without title.";
          if (event.type === "SUBTASK" /* SUBTASK */ && task.hasSubtasks()) {
            this.verboseRenderer(task.subtasks);
          } else if (event.type === "STATE" /* STATE */) {
            if (((_a2 = this.options) == null ? void 0 : _a2.logEmptyTitle) !== false || task.hasTitle()) {
              if (task.isPending()) {
                this.logger.start(taskTitle);
              } else if (task.isCompleted()) {
                this.logger.success(taskTitle + (((_b = this.options) == null ? void 0 : _b.showTimer) && ((_c = task.message) == null ? void 0 : _c.duration) ? ` [${parseTaskTime(task.message.duration)}]` : ""));
              }
            }
          } else if (event.type === "DATA" /* DATA */ && !!event.data) {
            this.logger.data(String(event.data));
          } else if (event.type === "TITLE" /* TITLE */) {
            if (((_d = this.options) == null ? void 0 : _d.logTitleChange) !== false) {
              this.logger.title(String(event.data));
            }
          } else if (event.type === "MESSAGE" /* MESSAGE */) {
            if ((_e = event.data) == null ? void 0 : _e.error) {
              this.logger.fail(String(event.data.error));
            } else if ((_f = event.data) == null ? void 0 : _f.skip) {
              this.logger.skip(String(event.data.skip));
            } else if ((_g = event.data) == null ? void 0 : _g.rollback) {
              this.logger.rollback(String(event.data.rollback));
            } else if ((_h = event.data) == null ? void 0 : _h.retry) {
              this.logger.retry(`[${event.data.retry.count}] ` + String(taskTitle));
            }
          }
        }
      }, (err) => {
        this.logger.fail(err);
      });
    });
  }
};
var VerboseRenderer = _VerboseRenderer;
VerboseRenderer.nonTTY = true;
VerboseRenderer.rendererOptions = {
  useIcons: false,
  logEmptyTitle: true,
  logTitleChange: true
};

// src/utils/renderer.ts
var renderers = {
  default: DefaultRenderer,
  simple: SimpleRenderer,
  verbose: VerboseRenderer,
  silent: SilentRenderer
};
function isRendererSupported(renderer) {
  return process.stdout.isTTY === true || renderer.nonTTY === true;
}
function getRendererClass(renderer) {
  if (typeof renderer === "string") {
    return renderers[renderer] || renderers.default;
  }
  return typeof renderer === "function" ? renderer : renderers.default;
}
function getRenderer(renderer, fallbackRenderer, fallbackCondition, silentCondition) {
  let returnValue;
  let ret = getRendererClass(renderer);
  returnValue = { renderer: ret, nonTTY: false };
  const evaluateSilent = assertFunctionOrSelf(silentCondition);
  const evaluateFallback = assertFunctionOrSelf(fallbackCondition);
  if (evaluateSilent) {
    ret = getRendererClass("silent");
    returnValue = { renderer: ret, nonTTY: true };
  } else if (!isRendererSupported(ret) || evaluateFallback) {
    ret = getRendererClass(fallbackRenderer);
    returnValue = { renderer: ret, nonTTY: true };
  }
  return returnValue;
}

// src/utils/uuid.ts
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 || 0;
    const v = c === "x" ? r : r && 3 || 8;
    return v.toString(16);
  });
}

// src/lib/task.ts
var Task = class extends import_rxjs.Subject {
  constructor(listr, tasks, options, rendererOptions) {
    super();
    this.listr = listr;
    this.tasks = tasks;
    this.options = options;
    this.rendererOptions = rendererOptions;
    this.message = {};
    var _a2, _b, _c, _d, _e, _f;
    this.id = generateUUID();
    this.title = (_a2 = this.tasks) == null ? void 0 : _a2.title;
    this.initialTitle = (_b = this.tasks) == null ? void 0 : _b.title;
    this.task = this.tasks.task;
    this.skip = (_d = (_c = this.tasks) == null ? void 0 : _c.skip) != null ? _d : false;
    this.enabledFn = (_f = (_e = this.tasks) == null ? void 0 : _e.enabled) != null ? _f : true;
    this.rendererTaskOptions = this.tasks.options;
    this.renderHook$ = this.listr.renderHook$;
    this.subscribe(() => {
      this.renderHook$.next();
    });
  }
  set state$(state) {
    this.state = state;
    this.next({
      type: "STATE" /* STATE */,
      data: state
    });
    if (this.hasSubtasks() && this.hasFailed()) {
      for (const subtask of this.subtasks) {
        if (subtask.state === "PENDING" /* PENDING */) {
          subtask.state$ = "FAILED" /* FAILED */;
        }
      }
    }
  }
  set output$(data) {
    this.output = data;
    this.next({
      type: "DATA" /* DATA */,
      data
    });
  }
  set message$(data) {
    this.message = __spreadValues(__spreadValues({}, this.message), data);
    this.next({
      type: "MESSAGE" /* MESSAGE */,
      data
    });
  }
  set title$(title) {
    this.title = title;
    this.next({
      type: "TITLE" /* TITLE */,
      data: title
    });
  }
  async check(ctx) {
    if (this.state === void 0) {
      this.enabled = await assertFunctionOrSelf(this.enabledFn, ctx);
      this.next({
        type: "ENABLED" /* ENABLED */,
        data: this.enabled
      });
    }
  }
  hasSubtasks() {
    var _a2;
    return ((_a2 = this.subtasks) == null ? void 0 : _a2.length) > 0;
  }
  isPending() {
    return this.state === "PENDING" /* PENDING */;
  }
  isSkipped() {
    return this.state === "SKIPPED" /* SKIPPED */;
  }
  isCompleted() {
    return this.state === "COMPLETED" /* COMPLETED */;
  }
  hasFailed() {
    return this.state === "FAILED" /* FAILED */;
  }
  isRollingBack() {
    return this.state === "ROLLING_BACK" /* ROLLING_BACK */;
  }
  hasRolledBack() {
    return this.state === "ROLLED_BACK" /* ROLLED_BACK */;
  }
  isRetrying() {
    return this.state === "RETRY" /* RETRY */;
  }
  isEnabled() {
    return this.enabled;
  }
  hasTitle() {
    return typeof (this == null ? void 0 : this.title) === "string";
  }
  isPrompt() {
    return !!this.prompt;
  }
  async run(context, wrapper) {
    var _a2, _b, _c, _d, _e;
    const handleResult = (result) => {
      if (result instanceof Listr) {
        result.options = __spreadValues(__spreadValues({}, this.options), result.options);
        result.rendererClass = getRenderer("silent").renderer;
        result.renderHook$.subscribe(() => {
          this.renderHook$.next();
        });
        this.subtasks = result.tasks;
        result.err = this.listr.err;
        this.next({ type: "SUBTASK" /* SUBTASK */ });
        result = result.run(context);
      } else if (this.isPrompt()) {
      } else if (result instanceof Promise) {
        result = result.then(handleResult);
      } else if (result instanceof import_stream.Readable) {
        result = new Promise((resolve, reject) => {
          result.on("data", (data) => {
            this.output$ = data.toString();
          });
          result.on("error", (error) => reject(error));
          result.on("end", () => resolve(null));
        });
      } else if (result instanceof import_rxjs.Observable) {
        result = new Promise((resolve, reject) => {
          result.subscribe({
            next: (data) => {
              this.output$ = data;
            },
            error: reject,
            complete: resolve
          });
        });
      }
      return result;
    };
    const startTime = Date.now();
    this.state$ = "PENDING" /* PENDING */;
    const skipped = await assertFunctionOrSelf(this.skip, context);
    if (skipped) {
      if (typeof skipped === "string") {
        this.message$ = { skip: skipped };
      } else if (this.hasTitle()) {
        this.message$ = { skip: this.title };
      } else {
        this.message$ = { skip: "Skipped task without a title." };
      }
      this.state$ = "SKIPPED" /* SKIPPED */;
      return;
    }
    try {
      const retryCount = ((_a2 = this.tasks) == null ? void 0 : _a2.retry) && ((_b = this.tasks) == null ? void 0 : _b.retry) > 0 ? this.tasks.retry + 1 : 1;
      for (let retries = 1; retries <= retryCount; retries++) {
        try {
          await handleResult(this.task(context, wrapper));
          break;
        } catch (err) {
          if (retries !== retryCount) {
            this.retry = { count: retries, withError: err };
            this.message$ = { retry: this.retry };
            this.title$ = this.initialTitle;
            this.output = void 0;
            wrapper.report(err, "WILL_RETRY" /* WILL_RETRY */);
            this.state$ = "RETRY" /* RETRY */;
          } else {
            throw err;
          }
        }
      }
      if (this.isPending() || this.isRetrying()) {
        this.message$ = { duration: Date.now() - startTime };
        this.state$ = "COMPLETED" /* COMPLETED */;
      }
    } catch (error) {
      if (this.prompt instanceof PromptError) {
        error = new Error(this.prompt.message);
      }
      if ((_c = this.tasks) == null ? void 0 : _c.rollback) {
        wrapper.report(error, "WILL_ROLLBACK" /* WILL_ROLLBACK */);
        try {
          this.state$ = "ROLLING_BACK" /* ROLLING_BACK */;
          await this.tasks.rollback(context, wrapper);
          this.state$ = "ROLLED_BACK" /* ROLLED_BACK */;
          this.message$ = { rollback: this.title };
        } catch (err) {
          this.state$ = "FAILED" /* FAILED */;
          wrapper.report(err, "HAS_FAILED_TO_ROLLBACK" /* HAS_FAILED_TO_ROLLBACK */);
          throw err;
        }
        if (((_d = this.listr.options) == null ? void 0 : _d.exitAfterRollback) !== false) {
          throw new Error(this.title);
        }
      } else {
        this.state$ = "FAILED" /* FAILED */;
        if (this.listr.options.exitOnError !== false && await assertFunctionOrSelf((_e = this.tasks) == null ? void 0 : _e.exitOnError, context) !== false) {
          wrapper.report(error, "HAS_FAILED" /* HAS_FAILED */);
          throw error;
        } else if (!this.hasSubtasks()) {
          wrapper.report(error, "HAS_FAILED_WITHOUT_ERROR" /* HAS_FAILED_WITHOUT_ERROR */);
        }
      }
    } finally {
      this.complete();
    }
  }
};

// src/lib/task-wrapper.ts
var import_through = __toESM(require("through"), 1);

// src/constants/clearline-regex.constants.ts
var CLEAR_LINE_REGEX = "(?:\\u001b|\\u009b)\\[[\\=><~/#&.:=?%@~_-]*[0-9]*[\\a-ln-tqyz=><~/#&.:=?%@~_-]+";
var BELL_REGEX = /\u0007/;

// src/utils/prompt.ts
function defaultCancelCallback(settings) {
  const errorMsg = "Cancelled prompt.";
  if (this instanceof TaskWrapper) {
    this.task.prompt = new PromptError(errorMsg);
  } else if ((settings == null ? void 0 : settings.error) !== false) {
    throw new Error(errorMsg);
  } else {
    return errorMsg;
  }
}
async function createPrompt(options, settings) {
  let cancelCallback;
  if (settings == null ? void 0 : settings.cancelCallback) {
    cancelCallback = settings.cancelCallback;
  } else {
    cancelCallback = defaultCancelCallback;
  }
  if (!Array.isArray(options)) {
    options = [__spreadProps(__spreadValues({}, options), { name: "default" })];
  } else if (options.length === 1) {
    options = options.reduce((o, option) => {
      return [...o, Object.assign(option, { name: "default" })];
    }, []);
  }
  options = options.reduce((o, option) => {
    var _a2;
    return [
      ...o,
      Object.assign(option, {
        stdout: this instanceof TaskWrapper ? (_a2 = settings == null ? void 0 : settings.stdout) != null ? _a2 : this.stdout() : process.stdout,
        onCancel: cancelCallback.bind(this, settings)
      })
    ];
  }, []);
  let enquirer;
  if (settings == null ? void 0 : settings.enquirer) {
    enquirer = settings.enquirer;
  } else {
    try {
      enquirer = new (await Promise.resolve().then(() => __toESM(require("enquirer"), 1))).default();
    } catch (e) {
      this.task.prompt = new PromptError("Enquirer is a peer dependency that must be installed separately.");
      throw new Error(e);
    }
  }
  if (this instanceof TaskWrapper) {
    enquirer.on("prompt", (prompt) => this.task.prompt = prompt);
    enquirer.on("submit", () => this.task.prompt = void 0);
    this.task.subscribe((event) => {
      if (event.type === "STATE" /* STATE */ && event.data === "SKIPPED" /* SKIPPED */) {
        if (this.task.prompt && !(this.task.prompt instanceof PromptError)) {
          this.task.prompt.submit();
        }
      }
    });
  }
  const response = await enquirer.prompt(options);
  if (options.length === 1) {
    return response.default;
  } else {
    return response;
  }
}
function destroyPrompt(throwError = false) {
  if (!this.task.prompt || this.task.prompt instanceof PromptError) {
    return;
  }
  if (throwError) {
    this.task.prompt.cancel();
  } else {
    this.task.prompt.submit();
  }
}

// src/lib/task-wrapper.ts
var TaskWrapper = class {
  constructor(task, errors, options) {
    this.task = task;
    this.errors = errors;
    this.options = options;
  }
  get title() {
    return this.task.title;
  }
  set title(data) {
    this.task.title$ = data;
  }
  get output() {
    return this.task.output;
  }
  set output(data) {
    this.task.output$ = data;
  }
  newListr(task, options) {
    let tasks;
    if (typeof task === "function") {
      tasks = task(this);
    } else {
      tasks = task;
    }
    return new Listr(tasks, options, this.task);
  }
  report(error, type) {
    var _a2, _b, _c;
    if (this.task.options.collectErrors !== false) {
      this.errors.push(new ListrError(error, type, this.task));
    }
    this.task.message$ = { error: (_c = (_b = error.message) != null ? _b : (_a2 = this.task) == null ? void 0 : _a2.title) != null ? _c : "Task with no title." };
  }
  skip(message) {
    var _a2, _b;
    this.task.state$ = "SKIPPED" /* SKIPPED */;
    if (message) {
      this.task.message$ = { skip: (_b = message != null ? message : (_a2 = this.task) == null ? void 0 : _a2.title) != null ? _b : "Task with no title." };
    }
  }
  isRetrying() {
    return this.task.isRetrying() ? this.task.retry : { count: 0 };
  }
  async prompt(options) {
    var _a2;
    return createPrompt.bind(this)(options, __spreadValues({}, (_a2 = this.options) == null ? void 0 : _a2.injectWrapper));
  }
  cancelPrompt(throwError = false) {
    return destroyPrompt.bind(this)(throwError);
  }
  stdout() {
    return (0, import_through.default)((chunk) => {
      chunk = chunk.toString();
      chunk = chunk.replace(new RegExp(CLEAR_LINE_REGEX, "gmi"), "");
      chunk = chunk.replace(new RegExp(BELL_REGEX, "gmi"), "");
      if (chunk !== "") {
        this.output = chunk;
      }
    });
  }
  run(ctx) {
    return this.task.run(ctx, this);
  }
};

// src/listr.ts
var Listr = class {
  constructor(task, options, parentTask) {
    this.task = task;
    this.options = options;
    this.parentTask = parentTask;
    this.tasks = [];
    this.err = [];
    this.renderHook$ = new import_rxjs2.Subject();
    this.path = [];
    var _a2, _b, _c;
    this.options = __spreadValues(__spreadValues({}, {
      concurrent: false,
      renderer: "default",
      nonTTYRenderer: "verbose",
      exitOnError: true,
      exitAfterRollback: true,
      collectErrors: "minimal",
      registerSignalListeners: true
    }), options);
    if (this.options.concurrent === true) {
      this.concurrency = Infinity;
    } else if (typeof this.options.concurrent === "number") {
      this.concurrency = this.options.concurrent;
    } else {
      this.concurrency = 1;
    }
    const renderer = getRenderer(this.options.renderer, this.options.nonTTYRenderer, (_a2 = this.options) == null ? void 0 : _a2.rendererFallback, (_b = this.options) == null ? void 0 : _b.rendererSilent);
    this.rendererClass = renderer.renderer;
    if (!renderer.nonTTY) {
      this.rendererClassOptions = this.options.rendererOptions;
    } else {
      this.rendererClassOptions = this.options.nonTTYRendererOptions;
    }
    this.add(task != null ? task : []);
    if (parentTask) {
      this.path = [...parentTask.listr.path, parentTask.title];
    }
    if (this.options.registerSignalListeners) {
      process.once("SIGINT", () => {
        this.tasks.forEach(async (task2) => {
          if (task2.isPending()) {
            task2.state$ = "FAILED" /* FAILED */;
          }
        });
        this.renderer.end(new Error("Interrupted."));
        process.exit(127);
      }).setMaxListeners(0);
    }
    if ((_c = this.options) == null ? void 0 : _c.disableColor) {
      process.env.LISTR_DISABLE_COLOR = "1";
    }
  }
  add(task) {
    const tasks = Array.isArray(task) ? task : [task];
    tasks.forEach((task2) => {
      this.tasks.push(new Task(this, task2, this.options, __spreadValues(__spreadValues({}, this.rendererClassOptions), task2.options)));
    });
  }
  async run(context) {
    var _a2, _b, _c;
    if (!this.renderer) {
      this.renderer = new this.rendererClass(this.tasks, this.rendererClassOptions, this.renderHook$);
    }
    this.renderer.render();
    this.ctx = (_c = (_b = (_a2 = this.options) == null ? void 0 : _a2.ctx) != null ? _b : context) != null ? _c : {};
    await this.checkAll(this.ctx);
    try {
      await (0, import_p_map.default)(this.tasks, async (task) => {
        await task.check(this.ctx);
        return this.runTask(task, this.ctx, this.err);
      }, { concurrency: this.concurrency });
      this.renderer.end();
    } catch (err) {
      if (this.options.exitOnError !== false) {
        this.renderer.end(err);
        throw err;
      }
    }
    return this.ctx;
  }
  checkAll(context) {
    return Promise.all(this.tasks.map((task) => task.check(context)));
  }
  runTask(task, context, errors) {
    if (!task.isEnabled()) {
      return Promise.resolve();
    }
    return new TaskWrapper(task, errors, this.options).run(context);
  }
};

// src/manager.ts
var Manager = class {
  constructor(options) {
    this.options = options;
    this.err = [];
    this.tasks = [];
  }
  set ctx(ctx) {
    this.options.ctx = ctx;
  }
  add(tasks, options) {
    options = __spreadValues(__spreadValues({}, this.options), options);
    this.tasks = [...this.tasks, this.indent(tasks, options)];
  }
  async runAll(options) {
    options = __spreadValues(__spreadValues({}, this.options), options);
    const ctx = await this.run(this.tasks, options);
    this.tasks = [];
    return ctx;
  }
  newListr(tasks, options) {
    return new Listr(tasks, options);
  }
  indent(tasks, options, taskOptions) {
    options = __spreadValues(__spreadValues({}, this.options), options);
    let newTask;
    if (typeof tasks === "function") {
      newTask = __spreadProps(__spreadValues({}, taskOptions), {
        task: (ctx) => this.newListr(tasks(ctx), options)
      });
    } else {
      newTask = __spreadProps(__spreadValues({}, taskOptions), {
        task: () => this.newListr(tasks, options)
      });
    }
    return newTask;
  }
  async run(tasks, options) {
    options = __spreadValues(__spreadValues({}, this.options), options);
    const task = this.newListr(tasks, options);
    const ctx = await task.run();
    this.err = task.err;
    return ctx;
  }
  getRuntime(pipetime) {
    return `${Math.round(Date.now() - pipetime) / 1e3}s`;
  }
};
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Listr,
  ListrError,
  ListrErrorTypes,
  ListrEventType,
  ListrTaskState,
  LogLevels,
  Logger,
  Manager,
  PromptError,
  createPrompt,
  destroyPrompt,
  figures
});
