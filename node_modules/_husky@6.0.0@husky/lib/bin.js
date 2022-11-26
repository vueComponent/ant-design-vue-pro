#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const _1 = require("./");
function readPkg() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
}
const pkg = readPkg();
const [, , cmd, ...args] = process.argv;
function version() {
    console.log(pkg.version);
}
function help() {
    console.log(`Usage
  husky install [dir] (default: .husky)
  husky uninstall
  husky set|add <file> [cmd]`);
}
function misuse() {
    help();
    process.exit(2);
}
const cmds = {
    install(dir) {
        args.length > 1 ? misuse() : _1.install(dir);
    },
    uninstall: _1.uninstall,
    set(...args) {
        args.length === 0 || args.length > 2 ? misuse() : _1.set(args[0], args[1]);
    },
    add(...args) {
        args.length === 0 || args.length > 2 ? misuse() : _1.add(args[0], args[1]);
    },
    '--version': version,
    '-v': version,
};
cmds[cmd] ? cmds[cmd](...args) : help();
