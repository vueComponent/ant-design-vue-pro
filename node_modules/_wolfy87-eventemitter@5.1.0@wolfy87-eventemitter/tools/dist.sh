#!/bin/bash
node_modules/.bin/uglifyjs\
    --comments\
    --mangle sort=true\
    --compress\
    --output EventEmitter.min.js EventEmitter.js