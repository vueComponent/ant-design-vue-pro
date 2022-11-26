var on = require('dom-event');
var insertCss = require('./');

document.querySelector('body').innerHTML = '<h1>insert-css example</h1><button id="blue">blue</button><button id="red">red</button>';

on(document.querySelector('#blue'), 'click', function() {
  insertCss('body{background: blue}');
});

on(document.querySelector('#red'), 'click', function() {
  insertCss('body{background: red}');
});
