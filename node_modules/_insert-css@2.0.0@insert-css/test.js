var test = require('tape');

test(function (t) {
    var insertCss = require('./');
    var initialNbStyleTags = nbStyleTags();

    // basic usage
    var baseStyle = 'body{position:relative;text-decoration:overline}';
    insertCss(baseStyle);
    t.equal(position(), 'relative', 'initial position is `relative`');

    // adds one style tag
    t.equal(nbStyleTags(), initialNbStyleTags + 1, 'we added one style tag');

    // default to appending style
    var appendStyle = 'body{position:absolute}';
    var appendStyleTag = insertCss(appendStyle);
    t.equal(position(), 'absolute', 'new position is `absolute`');

    // reuse same style tag
    t.equal(nbStyleTags(), initialNbStyleTags + 1, 'we kept using the same style tag');

    // prepend should add a new style tag before the append one
    t.equal(textDecoration(), 'overline', 'text-decoration is overline by default');
    var prependStyleTag = insertCss('body{text-decoration:underline !important}', {prepend: true});
    t.equal(nbStyleTags(), initialNbStyleTags + 2, 'we added a new style tag');
    t.equal(textDecoration(), 'underline', 'text-decoration is now underline');
    var tag = prependStyleTag;
    while (tag !== appendStyleTag) {
        tag = tag.nextSibling;
    }
    t.equal(tag, appendStyleTag, 'prepend mode should add a style tag before the append one');

    // uses old school styleSheet prop when present (IE)
    if (!appendStyleTag.styleSheet) {
        appendStyleTag.styleSheet = {cssText: 'a'};
        insertCss('p{color:blue}');
        t.equal(appendStyleTag.styleSheet.cssText, 'ap{color:blue}', 'we use old school styleSheet prop');
        delete appendStyleTag.styleSheet;
    }

    // allow re-adding added style
    insertCss(baseStyle);
    t.equal(position(), 'relative', 'position is again `relative`');

    // allow using a custom container
    var customContainer = document.createElement('div');
    document.querySelector('body').appendChild(customContainer);
    t.equal(nbStyleTags(customContainer), 0, 'no style tag in custom container');
    insertCss('body{position:absolute}', {container: customContainer});
    t.equal(nbStyleTags(customContainer), 1, 'new style tag added in custom container');
    t.equal(position(), 'absolute', 'position is absolute again');

    t.end();
});

test(function testEmpty(t) {
    var insertCss = require('./');

    t.equal(insertCss(), false, 'insertCss() with no arguments returns `false`');

    t.end();
});

function position() {
    var getStyle = require('computed-style');
    return getStyle(document.querySelector('body'), 'position');
}

function textDecoration() {
    var getStyle = require('computed-style');
    return getStyle(document.querySelector('body'), 'text-decoration');
}

function nbStyleTags(container) {
    if (!container) container = document;
    return container.querySelectorAll('style').length
}
