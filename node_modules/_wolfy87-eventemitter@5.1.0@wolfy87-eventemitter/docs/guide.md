# Guide

This guide should get you going with EventEmitter. Once finished you may wish to learn more about the script and use methods that are not shown here. At that point you should either browse [the API documentation](https://github.com/Olical/EventEmitter/blob/master/docs/api.md) or have a look around [the source](https://github.com/Olical/EventEmitter/blob/master/EventEmitter.js).

## Getting a copy of the script

### Cloning the full source as a submodule

```bash
git submodule add git://github.com/Olical/EventEmitter.git assets/js/EventEmitter
```

This will copy the whole repository, including all documentation and build scripts. Obviously you must replace the destination directory with your desired location.

### Downloading a minified version

You can get pre-built versions of EventEmitter from [the downloads page](https://github.com/Olical/EventEmitter/downloads). I would recommend using the latest version. It's the latest for a reason.

### Installing the component with Bower

EventEmitter can also be found in the [Bower package manager](https://github.com/twitter/bower). You can install with the following line.

```bash
bower install eventEmitter
```

You can also register EventEmitter as a dependency of your own Bower components for easy installation.

## Loading the script

### Browser via script tag

This is so obvious it hurts. Just remember to set the right path to load from.

```html
<script src='/assets/js/EventEmitter/EventEmitter.js'></script>
```

Or maybe you want to load a minified version you downloaded...

```html
<script src='/assets/js/EventEmitter-VERSION.min.js'></script>
```

You can then access it in your code like so.

```javascript
var ee = new EventEmitter();
```

### Browser via AMD

I love AMD, so I implemented it in EventEmitter. If the script is loaded into a page containing an AMD loader (such as [RequireJS](http://requirejs.org/)) then it will not be placed in the global namespace as it usually is. Instead it must be accessed via AMD like this.

```javascript
require(['EventEmitter'], function(EventEmitter) {
    var ee = new EventEmitter();
});
```

### node.js or Browser via Browserify

This is pretty simple, just install the file via npm (or bower):

```bash
npm install wolfy87-eventemitter --save
```

...and then require it (if you used bower you have to require the relative path to the bower component)

```javascript
var EventEmitter = require('wolfy87-eventemitter');
var ee = new EventEmitter();
```

## Extending with the EventEmitter class

You probably won't want to use EventEmitter as a raw class. You will probably want to write a `Player` class or something like that and implement EventEmitter's methods into it. To do this you will need to clone and merge EventEmitter's prototype object into your classes prototype object. Here is how I would do that with MooTools, I am sure there are alternatives for almost all other frameworks.

```javascript
function Player(){}
Player.prototype = Object.clone(EventEmitter.prototype);
```

If you do not want to use a huge framework like that then you might want to use this script I wrote, [Heir](https://github.com/Olical/Heir). It just makes prototypical inheritance nice and easy. So here is how you would inherit EventEmitter's methods with Heir.

```javascript
function Player(){}
heir.inherit(Player, EventEmitter);
```

That's all there is to it.

## Using EventEmitter

So by now you should be able to download a copy of the script, load it into your page and either use it on it's own or implement it's methods into your own classes. Now you need to work out how to actually use the script.

For all of the following examples we are going to presume the following code has already been executed.

```javascript
var ee = new EventEmitter();
```

This code simply creates an instance of EventEmitter to be used.

### Adding listeners

A listener is a function that is executed when an event is emitted. You can add them in a multitude of ways, the simplest of which is with the `addListener` method.

```javascript
function listener() {
    console.log('The foo event has been emitted.');
}

ee.addListener('foo', listener);
```

You can also add in bulk using the `addListeners` method (notice the "s" on the end). You can interact with addListeners in two ways, the first is to pass it an event name and array of listeners to add.

```javascript
function listener1() {
    console.log('ONE');
}

function listener2() {
    console.log('TWO');
}

ee.addListeners('foo', [listener1, listener2]);
```

The second way of calling addListeners involves passing an object of event names and listeners. You can either pass a single listener for each event or an array, just as you can see above.

```javascript
function listener1() {
    console.log('ONE');
}

function listener2() {
    console.log('TWO');
}

function listener3() {
    console.log('THREE');
}

ee.addListeners({
    foo: [listener1, listener2],
    bar: listener3
});
```

### Removing listeners

This works in the _exact_ same way as adding listeners. The only difference is that you replace the `add` in the method names with `remove`. Like this:

```javascript
function listener() {
    console.log('The foo event has been emitted.');
}

ee.addListener('foo', listener);
ee.removeListener('foo', listener);
```

If you want a listener to remove itself after it has been called or after a condition has been met then all you need to do is return true.

```javascript
function listener1() {
    // If a condition is met then remove the listener
    if(completed) {
        return true;
    }
}

function listener2() {
    // Always remove after use
    return true;
}

ee.addListeners('foo', [listener1, listener2]);
ee.emitEvent('foo');
```

If you do not want to, or can't for some reason, return true, you can set the return value using `setOnceReturnValue`.

```javascript
function listener() {
    // Always remove after use
    return 'REMOVE-ME';
}

ee.addListener('foo', listener);
ee.setOnceReturnValue('REMOVE-ME');
ee.emitEvent('foo');
```

Alternatively you can use the `addOnceListener` method, or it's alias, `once`.

```javascript
function listener() {
    // Do stuff
}

ee.addOnceListener('foo', listener);
ee.emitEvent('foo');
// The listener will be removed now...
ee.emitEvent('foo');

// The listener will only be executed once.
```

You can also remove whole events and all of their attached listeners with the `removeEvent` method. If you pass an event name to the method then it will remove that event and it's listeners.

```javascript
function listener1() {
    console.log('ONE');
}

function listener2() {
    console.log('TWO');
}

ee.addListeners('foo', [listener1, listener2]);
ee.removeEvent('foo');
```

However, if you leave it blank and do not pass an event name, then **all** events will be removed. It will wipe everything.

### Fetching the listeners

If you really need to then you can get an array of all listeners attached to an event with the `getListeners` method.

```javascript
function listener1() {
    console.log('ONE');
}

function listener2() {
    console.log('TWO');
}

ee.addListeners('foo', [listener1, listener2]);
ee.getListeners('foo');
```

### Emitting events

So once you have added your listeners and you are ready to start executing them, you can start to use the `emitEvent` method. At it's most basic level it will just execute all listeners attached to an event.

```javascript
function listener1() {
    console.log('ONE');
}

function listener2() {
    console.log('TWO');
}

ee.addListeners('foo', [listener1, listener2]);
ee.emitEvent('foo');
```

For more control, you can pass an arguments array as the second argument. This array will be applied to every listener as individual arguments.

```javascript
function adder(a, b) {
    console.log(a + b);
}

ee.addListener('addStuff', adder);
ee.emitEvent('addStuff', [10, 20]);
```

### Method aliases

[Hebo](https://github.com/Hebo), from GitHub, [contributed three aliases](https://github.com/Olical/EventEmitter/pull/35#issuecomment-9920932) to add, remove and emit. The aliases can be found in the [API documentation](https://github.com/Olical/EventEmitter/blob/master/docs/api.md) but here is the mapping.

 * `on` - `addListener`
 * `off` - `removeListener`
 * `trigger` - `emitEvent`

I've also added one since then.

 * `once` - `addOnceListener`

### Using regular expressions

You can pass a regular expression to pretty much every function in EventEmitter in place of an event name string. So if you have two events, say, bar and baz, you can manipulate both of them with `/ba[rz]/`.

This applies to adding, removing and emitting events as well as a few others. There is one thing you have to remember when using this though, you must have the event defined before you use it in a regex.

By defined I mean, it has to have some other listener added to it, or you have to explicitly define it with the `defineEvent` / `defineEvents` functions. Here is an example of defining some events and adding to both with a regular expression.

```javascript
ee.defineEvents(['bar', 'baz']);
ee.addListener(/ba[rz]/, function () {
    console.log('Now you are thinking with regular expressions.');
});
ee.emitEvent(/ba[rz]/);
```
