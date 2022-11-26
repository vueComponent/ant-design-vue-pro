#!/usr/bin/env node
process.env.DEBUG = 'app:*';
const debug = require('debug')('app:pages');
const fs = require('fs');
const ghpages = require('gh-pages');
const path = require('path');
const shelljs = require('shelljs');

const pathnames = [
  './build',
  './README.md',
  './dist',
  './demos'
];

const tempDir = path.join(process.cwd(), './_home');
shelljs.rm('-rf', tempDir);
shelljs.mkdir('-p', tempDir);
fs.writeFileSync(path.join(tempDir, '.gitignore'), ' ', 'utf8');
pathnames.forEach(pathname => {
  shelljs.cp('-r', path.join(process.cwd(), pathname), tempDir);
});

ghpages.publish(tempDir, {
  add: true,
  dotfiles: true
}, err => {
  debug(err);
  shelljs.rm('-rf', tempDir);
});

