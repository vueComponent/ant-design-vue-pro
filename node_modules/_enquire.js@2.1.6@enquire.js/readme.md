# [enquire.js](http://wickynilliams.github.com/enquire.js/) - Awesome Media Queries in JavaScript

[![Build Status](https://travis-ci.org/WickyNilliams/enquire.js.svg)](https://travis-ci.org/WickyNilliams/enquire.js)

`enquire.js` is a lightweight, pure javascript library (with **no dependencies**) for programmatically responding to media queries.

## Getting enquire.js

### Download

Get the latest build, ready to go:

 * [Development](https://github.com/WickyNilliams/enquire.js/raw/master/dist/enquire.js) - unminified
 * [Production](https://github.com/WickyNilliams/enquire.js/raw/master/dist/enquire.min.js) - minified

### Install via Bower

To install via bower, enter the following at the command line:

    bower install enquire

### Install via npm

To install via npm, enter the following at the command line:

    npm install enquire.js

### Build From Source

If you want build from source (and run all unit tests etc):

    git clone git://github.com/WickyNilliams/enquire.js.git
    cd enquire.js
    npm install
    grunt

Booya!

## Quick Start

The main method you will be dealing with is `register`. It's basic signature is as follows:

```javascript
enquire.register(query /* string */, handler /* object || array  || function */);
```

`query` is the CSS media query you wish to respond to, and `handler` is an object containing any logic to handle the query. An example of usage is as follows:

```javascript
enquire.register("screen and (max-width:1000px)", {

    match : function() {},      // OPTIONAL
                                // If supplied, triggered when the media query transitions
                                // *from an unmatched to a matched state*

    unmatch : function() {},    // OPTIONAL
                                // If supplied, triggered when the media query transitions
                                // *from a matched state to an unmatched state*.
                                // Also may be called when handler is unregistered (if destroy is not available)

    setup : function() {},      // OPTIONAL
                                // If supplied, triggered once immediately upon registration of the handler

    destroy : function() {},    // OPTIONAL
                                // If supplied, triggered when handler is unregistered. Place cleanup code here

    deferSetup : true           // OPTIONAL, defaults to false
                                // If set to true, defers execution the setup function
                                // until the media query is first matched. still triggered just once
});
```

This should be enough to get you going, but **please read the full [enquire.js documentation](http://wickynilliams.github.com/enquire.js/)** if you wish to learn about the other cool features.

## Contributing

* Got an awesome idea?
* Found a *not-so*-awesome bug?
* Wish to get my attention through an inappropriate communication channel?!

Then please don't hesitate to raise an issue, they will *all* be looked at and tended to.

And for all the cool cats who are prepared to give their time to contribute code, feel free to open a pull request. If you could write unit tests to accompany your pull request that would be pretty sweet, but no worries if not - if it's good enough to be merged in, it's good enough for me to spend a little time to write tests on your behalf :-)

## License

License: MIT (http://www.opensource.org/licenses/mit-license.php)


