# API

Each of the methods listed in the API are accessed through an instance of EventEmitter. You can create an instance with `var ee = new EventEmitter();`. Then you can call API methods from `ee`, for example `ee.emitEvent('foo');`.

You may also be interested in [the guide](https://github.com/Olical/EventEmitter/blob/master/docs/guide.md) which highlights some key features of EventEmitter and how to use them. It is a broad overview of the script whereas this is concise information about each method in the API.

## EventEmitter

<p>Class for managing events.<br />Can be extended to provide event functionality in other classes.</p>

 * **class** - [object Object]

## getListeners

<p>Returns the listener array for the specified event.<br />Will initialise the event object and listener arrays if required.<br />Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.<br />Each property in the object response is an array of listener functions.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to return the listeners from.
 * **return** (`Function[]``Object`) - All listener functions for the event.

## flattenListeners

<p>Takes a list of listener objects and flattens it into a list of listener functions.</p>

 * **param** (`Object[]`) _listeners_ - Raw listener objects.
 * **return** (`Function[]`) - Just the listener functions.

## getListenersAsObject

<p>Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to return the listeners from.
 * **return** (`Object`) - All listener functions for an event in an object.

## addListener

<p>Adds a listener function to the specified event.<br />The listener will not be added if it is a duplicate.<br />If the listener returns true then it will be removed after it is called.<br />If you pass a regular expression as the event name then the listener will be added to all events that match it.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to attach the listener to.
 * **param** (`Function`) _listener_ - Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## on

<p>Alias of addListener</p>


## addOnceListener

<p>Semi-alias of addListener. It will add a listener that will be<br />automatically removed after its first execution.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to attach the listener to.
 * **param** (`Function`) _listener_ - Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## once

<p>Alias of addOnceListener.</p>


## defineEvent

<p>Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don&#39;t do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.<br />You need to tell it what event names should be matched by a regex.</p>

 * **param** (`String`) _evt_ - Name of the event to create.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## defineEvents

<p>Uses defineEvent to define multiple events.</p>

 * **param** (`String[]`) _evts_ - An array of event names to define.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## removeListener

<p>Removes a listener function from the specified event.<br />When passed a regular expression as the event name, it will remove the listener from all events that match it.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to remove the listener from.
 * **param** (`Function`) _listener_ - Method to remove from the event.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## off

<p>Alias of removeListener</p>


## addListeners

<p>Adds listeners in bulk using the manipulateListeners method.<br />If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.<br />You can also pass it a regular expression to add the array of listeners to all events that match it.<br />Yeah, this function does quite a bit. That&#39;s probably a bad thing.</p>

 * **param** (`String``Object``RegExp`) _evt_ - An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
 * **param** (`Function[]`) _[listeners]_ - An optional array of listener functions to add.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## removeListeners

<p>Removes listeners in bulk using the manipulateListeners method.<br />If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.<br />You can also pass it an event name and an array of listeners to be removed.<br />You can also pass it a regular expression to remove the listeners from all events that match it.</p>

 * **param** (`String``Object``RegExp`) _evt_ - An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
 * **param** (`Function[]`) _[listeners]_ - An optional array of listener functions to remove.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## manipulateListeners

<p>Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.<br />The first argument will determine if the listeners are removed (true) or added (false).<br />If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.<br />You can also pass it an event name and an array of listeners to be added/removed.<br />You can also pass it a regular expression to manipulate the listeners of all events that match it.</p>

 * **param** (`Boolean`) _remove_ - True if you want to remove listeners, false if you want to add.
 * **param** (`String``Object``RegExp`) _evt_ - An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
 * **param** (`Function[]`) _[listeners]_ - An optional array of listener functions to add/remove.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## removeEvent

<p>Removes all listeners from a specified event.<br />If you do not specify an event then all listeners will be removed.<br />That means every event will be emptied.<br />You can also pass a regex to remove all events that match it.</p>

 * **param** (`String``RegExp`) _[evt]_ - Optional name of the event to remove all listeners for. Will remove from every event if not passed.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## removeAllListeners

<p>Alias of removeEvent.</p><p>Added to mirror the node API.</p>


## emitEvent

<p>Emits an event of your choice.<br />When emitted, every listener attached to that event will be executed.<br />If you pass the optional argument array then those arguments will be passed to every listener upon execution.<br />Because it uses <code>apply</code>, your array of arguments will be passed as if you wrote them out separately.<br />So they will not arrive within the array on the other side, they will be separate.<br />You can also pass a regular expression to emit to all events that match it.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to emit and execute listeners for.
 * **param** (`Array`) _[args]_ - Optional array of arguments to be passed to each listener.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## trigger

<p>Alias of emitEvent</p>


## emit

<p>Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.<br />As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.</p>

 * **param** (`String``RegExp`) _evt_ - Name of the event to emit and execute listeners for.
 * **param** (`...*`) _Optional_ - additional arguments to be passed to each listener.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## setOnceReturnValue

<p>Sets the current value to check against when executing listeners. If a<br />listeners return value matches the one set here then it will be removed<br />after execution. This value defaults to true.</p>

 * **param** (`*`) _value_ - The new value to check for when executing listeners.
 * **return** (`Object`) - Current instance of EventEmitter for chaining.

## noConflict

<p>Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.</p>

 * **return** (`Function`) - Non conflicting EventEmitter class.

