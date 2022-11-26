#!/bin/bash
node_modules/.bin/dox < EventEmitter.js > docs/data.json
node_modules/.bin/dustc --name=api docs/api.dust docs/api.dust.js
node docs/render.js