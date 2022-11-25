"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstall = exports.add = exports.set = exports.install = void 0;
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
function l(msg) {
    console.log(`husky - ${msg}`);
}
function install(dir = '.husky') {
    if (cp.spawnSync('git', ['rev-parse']).status !== 0) {
        l('not a Git repository, skipping hooks installation');
        return;
    }
    const url = 'https://typicode.github.io/husky/#/?id=custom-directory';
    if (!path.resolve(process.cwd(), dir).startsWith(process.cwd())) {
        throw new Error(`.. not allowed (see ${url})`);
    }
    if (!fs.existsSync('.git')) {
        throw new Error(`.git can't be found (see ${url})`);
    }
    try {
        fs.mkdirSync(path.join(dir, '_'), { recursive: true });
        fs.writeFileSync(path.join(dir, '.gitignore'), '_\n');
        fs.copyFileSync(path.join(__dirname, 'husky.sh'), path.join(dir, '_/husky.sh'));
        const { error } = cp.spawnSync('git', ['config', 'core.hooksPath', dir]);
        if (error) {
            throw error;
        }
    }
    catch (e) {
        l('Git hooks failed to install');
        throw e;
    }
    l('Git hooks installed');
}
exports.install = install;
function set(file, cmd) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        throw new Error(`can't create hook, ${dir} directory doesn't exist (try running husky install)`);
    }
    fs.writeFileSync(file, `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

${cmd}
`, { mode: 0o0755 });
    l(`created ${file}`);
}
exports.set = set;
function add(file, cmd) {
    if (fs.existsSync(file)) {
        fs.appendFileSync(file, `${cmd}\n`);
        l(`updated ${file}`);
    }
    else {
        set(file, cmd);
    }
}
exports.add = add;
function uninstall() {
    cp.spawnSync('git', ['config', '--unset', 'core.hooksPath'], {
        stdio: 'inherit',
    });
}
exports.uninstall = uninstall;
