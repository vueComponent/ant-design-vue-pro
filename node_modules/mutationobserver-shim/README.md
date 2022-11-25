MutationObserver
========================

[![Browser Test Status](https://saucelabs.com/browser-matrix/mutationobserver.svg)](https://saucelabs.com/u/mutationobserver)  
<sup>Note: the svg swapped the working browsers; IE8 works while IE7 fails 1 test</sup>

A polyfill for the [MutationObserver API](http://www.w3.org/TR/2013/WD-dom-20131107/#mutation-observers) ([can I use?](http://caniuse.com/mutationobserver)). The polyfill is more cause we can than should (with subtree at any rate)... It's async and uses a recursive timeout fallback (default checks changes every 30ms + runtime) instead of using the deprecated [DOM3 MutationEvents](http://www.w3.org/TR/DOM-Level-3-Events/#events-mutationevents) so theoretically can support virtually any environment.  

```sh
$ npm install mutationobserver-shim
$ bower install MutationObserver-shim
```

CDN [![](https://data.jsdelivr.com/v1/package/npm/mutationobserver-shim/badge)](https://www.jsdelivr.com/package/npm/mutationobserver-shim)

```html
<script src="//cdn.jsdelivr.net/npm/mutationobserver-shim/dist/mutationobserver.min.js"></script>
```

### Polyfill differences from standard interface

#### MutationObserver

* Implemented using a recursive `setTimeout` (every ~30 ms) rather than using a `setImmediate` polyfill; so calls will be made less frequently and likely with more data than the standard MutationObserver. In addition, it can miss changes that occur and then are lost in the interval window.
* Setting an observed elements html using `innerHTML` will call `childList` observer listeners with several mutations with only 1 addedNode or removed node per mutation. With the standard you would have 1 call with multiple nodes in addedNodes and removedNodes node lists.
* With `childList` and `subtree` changes in node order (eg first element gets swapped with last) should fire a `addedNode` and `removedNode` mutation but the correct node may not always be identified.

#### MutationRecord

* `addedNodes` and `removedNodes` are arrays instead of `NodeList`s
* `oldValue` is always called with attribute changes
* `nextSibling` and `previousSibling` correctfullness is questionable (hard to know if the order of appended items). I'd suggest not relying on them anyway (my tests are extremely permissive with these attributes)

### Supported MutationObserverInit properties

Currently supports the following [MutationObserverInit properties](https://developer.mozilla.org/en/docs/Web/API/MutationObserver#MutationObserverInit):

* **childList**: Set to truthy if mutations to target's immediate children are to be observed.
* **subtree**: Set to truthy to do deep scans on a target's children.
* **attributes**: Set to truthy if mutations to target's children are to be observed. As explained in #4, the `style` attribute may not be matched in ie<8.
* **attributeFilter**: Set to an array of attribute local names (without namespace) if not all attribute mutations need to be observed.
* **attributeOldValue**: doesn't do anything attributes are always called with old value
* **characterData**: currently follows Mozilla's implementation in that it will only watch `textNodes` values and not, like in webkit, where setting .innerHTML will add a characterData mutation.

### Performance

By default, the polyfill will check observed nodes about 25 times per second (30 ms interval) for mutations. Try running [these jsperf.com tests](http://jsperf.com/mutationobserver-shim) and the JSLitmus tests in the test suite for usage performance tests. It may be worthwile to adapt `MutationObserver._period` based on UA or heuristics (todo).

From my tests observing any size element without `subtree` enabled is relatively cheap. Although I've optimized the subtree check to the best of my abilities it can be costly on large trees. You can draw your own conclusions based on the JSLitmus and jsperf tests noting that you can expect the `mo` to do its check 28+ times a second (by default).

Although supported, I'd recommend against watching `attributes` on the `subtree` on large structures, as the check is complex and expensive on terrible hardware like my phone :(

The included minified file has been tuned for performance.

### Compatibility

I've tested and verified compatibility in the following browsers + [these Sauce browsers](https://saucelabs.com/u/mutationobserver)

* Internet Explorer 8 (emulated), 9, 10 in win7 and win8
* Firefox 4, 21, 24, 26 in OSX, win7 and win8
* Opera 11.8, 12.16 in win7
* "Internet" on Android HTC One V
* Blackberry 6.0.16

Try [running the test suite](https://rawgithub.com/megawac/MutationObserver.js/master/test/index.html) and see some simple example usage:

* http://jsbin.com/suqewogone listen to images being appended dynamically
* http://jsbin.com/bapohopuwi autoscroll an element as new content is added

See http://dev.opera.com/articles/view/mutation-observers-tutorial/ for some sample usage.
