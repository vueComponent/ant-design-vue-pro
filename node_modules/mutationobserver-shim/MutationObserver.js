/*!
 * Shim for MutationObserver interface
 * Author: Graeme Yeates (github.com/megawac)
 * Repository: https://github.com/megawac/MutationObserver.js
 * License: WTFPL V2, 2004 (wtfpl.net).
 * Though credit and staring the repo will make me feel pretty, you can modify and redistribute as you please.
 * Attempts to follow spec (https://www.w3.org/TR/dom/#mutation-observers) as closely as possible for native javascript
 * See https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/MutationObserver.cpp for current webkit source c++ implementation
 */

/**
 * prefix bugs:
    - https://bugs.webkit.org/show_bug.cgi?id=85161
    - https://bugzilla.mozilla.org/show_bug.cgi?id=749920
 * Don't use WebKitMutationObserver as Safari (6.0.5-6.1) use a buggy implementation
*/
if (!window.MutationObserver) {
    window.MutationObserver = (function (undefined) {
        "use strict";
        /**
         * @param {function(Array.<MutationRecord>, MutationObserver)} listener
         * @constructor
         */
        function MutationObserver(listener) {
            /**
             * @type {Array.<Object>}
             * @private
             */
            this._watched = [];
            /** @private */
            this._listener = listener;
        }

        /**
         * Start a recursive timeout function to check all items being observed for mutations
         * @type {MutationObserver} observer
         * @private
         */
        function startMutationChecker(observer) {
            (function check() {
                var mutations = observer.takeRecords();

                if (mutations.length) { // fire away
                    // calling the listener with context is not spec but currently consistent with FF and WebKit
                    observer._listener(mutations, observer);
                }
                /** @private */
                observer._timeout = setTimeout(check, MutationObserver._period);
            })();
        }

        /**
         * Period to check for mutations (~32 times/sec)
         * @type {number}
         * @expose
         */
        MutationObserver._period = 30 /*ms+runtime*/;

        /**
         * Exposed API
         * @expose
         * @final
         */
        MutationObserver.prototype = {
            /**
             * see https://dom.spec.whatwg.org/#dom-mutationobserver-observe
             * not going to throw here but going to follow the current spec config sets
             * @param {Node|null} $target
             * @param {Object|null} config : MutationObserverInit configuration dictionary
             * @expose
             * @return undefined
             */
            observe: function ($target, config) {
                /**
                 * Using slightly different names so closure can go ham
                 * @type {!Object} : A custom mutation config
                 */
                var settings = {
                    attr: !!(config.attributes || config.attributeFilter || config.attributeOldValue),

                    // some browsers enforce that subtree must be set with childList, attributes or characterData.
                    // We don't care as spec doesn't specify this rule.
                    kids: !!config.childList,
                    descendents: !!config.subtree,
                    charData: !!(config.characterData || config.characterDataOldValue)
                };

                var watched = this._watched;

                // remove already observed target element from pool
                for (var i = 0; i < watched.length; i++) {
                    if (watched[i].tar === $target) watched.splice(i, 1);
                }

                if (config.attributeFilter) {
                    /**
                     * converts to a {key: true} dict for faster lookup
                     * @type {Object.<String,Boolean>}
                     */
                    settings.afilter = reduce(config.attributeFilter, function (a, b) {
                        a[b] = true;
                        return a;
                    }, {});
                }

                watched.push({
                    tar: $target,
                    fn: createMutationSearcher($target, settings)
                });

                // reconnect if not connected
                if (!this._timeout) {
                    startMutationChecker(this);
                }
            },

            /**
             * Finds mutations since last check and empties the "record queue" i.e. mutations will only be found once
             * @expose
             * @return {Array.<MutationRecord>}
             */
            takeRecords: function () {
                var mutations = [];
                var watched = this._watched;

                for (var i = 0; i < watched.length; i++) {
                    watched[i].fn(mutations);
                }

                return mutations;
            },

            /**
             * @expose
             * @return undefined
             */
            disconnect: function () {
                this._watched = []; // clear the stuff being observed
                clearTimeout(this._timeout); // ready for garbage collection
                /** @private */
                this._timeout = null;
            }
        };

        /**
         * Simple MutationRecord pseudoclass. No longer exposing as its not fully compliant
         * @param {Object} data
         * @return {Object} a MutationRecord
         */
        function MutationRecord(data) {
            var settings = { // technically these should be on proto so hasOwnProperty will return false for non explicitly props
                type: null,
                target: null,
                addedNodes: [],
                removedNodes: [],
                previousSibling: null,
                nextSibling: null,
                attributeName: null,
                attributeNamespace: null,
                oldValue: null
            };
            for (var prop in data) {
                if (has(settings, prop) && data[prop] !== undefined) settings[prop] = data[prop];
            }
            return settings;
        }

        /**
         * Creates a func to find all the mutations
         *
         * @param {Node} $target
         * @param {!Object} config : A custom mutation config
         */
        function createMutationSearcher($target, config) {
            /** type {Elestuct} */
            var $oldstate = clone($target, config); // create the cloned datastructure

            /**
             * consumes array of mutations we can push to
             *
             * @param {Array.<MutationRecord>} mutations
             */
            return function (mutations) {
                var olen = mutations.length, dirty;

                if (config.charData && $target.nodeType === 3 && $target.nodeValue !== $oldstate.charData) {
                    mutations.push(new MutationRecord({
                        type: "characterData",
                        target: $target,
                        oldValue: $oldstate.charData
                    }));
                }

                // Alright we check base level changes in attributes... easy
                if (config.attr && $oldstate.attr) {
                    findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
                }

                // check childlist or subtree for mutations
                if (config.kids || config.descendents) {
                    dirty = searchSubtree(mutations, $target, $oldstate, config);
                }

                // reclone data structure if theres changes
                if (dirty || mutations.length !== olen) {
                    /** type {Elestuct} */
                    $oldstate = clone($target, config);
                }
            };
        }

        /* attributes + attributeFilter helpers */

        // Check if the environment has the attribute bug (#4) which cause
        // element.attributes.style to always be null.
        var hasAttributeBug = document.createElement("i");
        hasAttributeBug.style.top = 0;
        hasAttributeBug = hasAttributeBug.attributes.style.value != "null";

        /**
         * Gets an attribute value in an environment without attribute bug
         *
         * @param {Node} el
         * @param {Attr} attr
         * @return {String} an attribute value
         */
        function getAttributeSimple(el, attr) {
            // There is a potential for a warning to occur here if the attribute is a
            // custom attribute in IE<9 with a custom .toString() method. This is
            // just a warning and doesn't affect execution (see #21)
            return attr.value;
        }

        /**
         * Gets an attribute value with special hack for style attribute (see #4)
         *
         * @param {Node} el
         * @param {Attr} attr
         * @return {String} an attribute value
         */
        function getAttributeWithStyleHack(el, attr) {
            // As with getAttributeSimple there is a potential warning for custom attribtues in IE7.
            return attr.name !== "style" ? attr.value : el.style.cssText;
        }

        var getAttributeValue = hasAttributeBug ? getAttributeSimple : getAttributeWithStyleHack;

        /**
         * fast helper to check to see if attributes object of an element has changed
         * doesnt handle the textnode case
         *
         * @param {Array.<MutationRecord>} mutations
         * @param {Node} $target
         * @param {Object.<string, string>} $oldstate : Custom attribute clone data structure from clone
         * @param {Object} filter
         */
        function findAttributeMutations(mutations, $target, $oldstate, filter) {
            var checked = {};
            var attributes = $target.attributes;
            var attr;
            var name;
            var i = attributes.length;
            while (i--) {
                attr = attributes[i];
                name = attr.name;
                if (!filter || has(filter, name)) {
                    if (getAttributeValue($target, attr) !== $oldstate[name]) {
                        // The pushing is redundant but gzips very nicely
                        mutations.push(MutationRecord({
                            type: "attributes",
                            target: $target,
                            attributeName: name,
                            oldValue: $oldstate[name],
                            attributeNamespace: attr.namespaceURI // in ie<8 it incorrectly will return undefined
                        }));
                    }
                    checked[name] = true;
                }
            }
            for (name in $oldstate) {
                if (!(checked[name])) {
                    mutations.push(MutationRecord({
                        target: $target,
                        type: "attributes",
                        attributeName: name,
                        oldValue: $oldstate[name]
                    }));
                }
            }
        }

        /**
         * searchSubtree: array of mutations so far, element, element clone, bool
         * synchronous dfs comparision of two nodes
         * This function is applied to any observed element with childList or subtree specified
         * Sorry this is kind of confusing as shit, tried to comment it a bit...
         * codereview.stackexchange.com/questions/38351 discussion of an earlier version of this func
         *
         * @param {Array} mutations
         * @param {Node} $target
         * @param {!Object} $oldstate : A custom cloned node from clone()
         * @param {!Object} config : A custom mutation config
         */
        function searchSubtree(mutations, $target, $oldstate, config) {
            // Track if the tree is dirty and has to be recomputed (#14).
            var dirty;
            /*
             * Helper to identify node rearrangment and stuff...
             * There is no gaurentee that the same node will be identified for both added and removed nodes
             * if the positions have been shuffled.
             * conflicts array will be emptied by end of operation
             */
            function resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes) {
                // the distance between the first conflicting node and the last
                var distance = conflicts.length - 1;
                // prevents same conflict being resolved twice consider when two nodes switch places.
                // only one should be given a mutation event (note -~ is used as a math.ceil shorthand)
                var counter = -~((distance - numAddedNodes) / 2);
                var $cur;
                var oldstruct;
                var conflict;
                while ((conflict = conflicts.pop())) {
                    $cur = $kids[conflict.i];
                    oldstruct = $oldkids[conflict.j];

                    // attempt to determine if there was node rearrangement... won't gaurentee all matches
                    // also handles case where added/removed nodes cause nodes to be identified as conflicts
                    if (config.kids && counter && Math.abs(conflict.i - conflict.j) >= distance) {
                        mutations.push(MutationRecord({
                            type: "childList",
                            target: node,
                            addedNodes: [$cur],
                            removedNodes: [$cur],
                            // haha don't rely on this please
                            nextSibling: $cur.nextSibling,
                            previousSibling: $cur.previousSibling
                        }));
                        counter--; // found conflict
                    }

                    // Alright we found the resorted nodes now check for other types of mutations
                    if (config.attr && oldstruct.attr) findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
                    if (config.charData && $cur.nodeType === 3 && $cur.nodeValue !== oldstruct.charData) {
                        mutations.push(MutationRecord({
                            type: "characterData",
                            target: $cur,
                            oldValue: oldstruct.charData
                        }));
                    }
                    // now look @ subtree
                    if (config.descendents) findMutations($cur, oldstruct);
                }
            }

            /**
             * Main worker. Finds and adds mutations if there are any
             * @param {Node} node
             * @param {!Object} old : A cloned data structure using internal clone
             */
            function findMutations(node, old) {
                var $kids = node.childNodes;
                var $oldkids = old.kids;
                var klen = $kids.length;
                // $oldkids will be undefined for text and comment nodes
                var olen = $oldkids ? $oldkids.length : 0;
                // if (!olen && !klen) return; // both empty; clearly no changes

                // we delay the intialization of these for marginal performance in the expected case (actually quite signficant on large subtrees when these would be otherwise unused)
                // map of checked element of ids to prevent registering the same conflict twice
                var map;
                // array of potential conflicts (ie nodes that may have been re arranged)
                var conflicts;
                var id; // element id from getElementId helper
                var idx; // index of a moved or inserted element

                var oldstruct;
                // current and old nodes
                var $cur;
                var $old;
                // track the number of added nodes so we can resolve conflicts more accurately
                var numAddedNodes = 0;

                // iterate over both old and current child nodes at the same time
                var i = 0, j = 0;
                // while there is still anything left in $kids or $oldkids (same as i < $kids.length || j < $oldkids.length;)
                while (i < klen || j < olen) {
                    // current and old nodes at the indexs
                    $cur = $kids[i];
                    oldstruct = $oldkids[j];
                    $old = oldstruct && oldstruct.node;

                    if ($cur === $old) { // expected case - optimized for this case
                        // check attributes as specified by config
                        if (config.attr && oldstruct.attr) /* oldstruct.attr instead of textnode check */findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
                        // check character data if node is a comment or textNode and it's being observed
                        if (config.charData && oldstruct.charData !== undefined && $cur.nodeValue !== oldstruct.charData) {
                            mutations.push(MutationRecord({
                                type: "characterData",
                                target: $cur,
                                oldValue: oldstruct.charData
                            }));
                        }

                        // resolve conflicts; it will be undefined if there are no conflicts - otherwise an array
                        if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);

                        // recurse on next level of children. Avoids the recursive call when there are no children left to iterate
                        if (config.descendents && ($cur.childNodes.length || oldstruct.kids && oldstruct.kids.length)) findMutations($cur, oldstruct);

                        i++;
                        j++;
                    } else { // (uncommon case) lookahead until they are the same again or the end of children
                        dirty = true;
                        if (!map) { // delayed initalization (big perf benefit)
                            map = {};
                            conflicts = [];
                        }
                        if ($cur) {
                            // check id is in the location map otherwise do a indexOf search
                            if (!(map[id = getElementId($cur)])) { // to prevent double checking
                                // mark id as found
                                map[id] = true;
                                // custom indexOf using comparitor checking oldkids[i].node === $cur
                                if ((idx = indexOfCustomNode($oldkids, $cur, j)) === -1) {
                                    if (config.kids) {
                                        mutations.push(MutationRecord({
                                            type: "childList",
                                            target: node,
                                            addedNodes: [$cur], // $cur is a new node
                                            nextSibling: $cur.nextSibling,
                                            previousSibling: $cur.previousSibling
                                        }));
                                        numAddedNodes++;
                                    }
                                } else {
                                    conflicts.push({ // add conflict
                                        i: i,
                                        j: idx
                                    });
                                }
                            }
                            i++;
                        }

                        if ($old &&
                            // special case: the changes may have been resolved: i and j appear congurent so we can continue using the expected case
                            $old !== $kids[i]
                        ) {
                            if (!(map[id = getElementId($old)])) {
                                map[id] = true;
                                if ((idx = indexOf($kids, $old, i)) === -1) {
                                    if (config.kids) {
                                        mutations.push(MutationRecord({
                                            type: "childList",
                                            target: old.node,
                                            removedNodes: [$old],
                                            nextSibling: $oldkids[j + 1], // praise no indexoutofbounds exception
                                            previousSibling: $oldkids[j - 1]
                                        }));
                                        numAddedNodes--;
                                    }
                                } else {
                                    conflicts.push({
                                        i: idx,
                                        j: j
                                    });
                                }
                            }
                            j++;
                        }
                    }// end uncommon case
                }// end loop

                // resolve any remaining conflicts
                if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
            }
            findMutations($target, $oldstate);
            return dirty;
        }

        /**
         * Utility
         * Cones a element into a custom data structure designed for comparision. https://gist.github.com/megawac/8201012
         *
         * @param {Node} $target
         * @param {!Object} config : A custom mutation config
         * @return {!Object} : Cloned data structure
         */
        function clone($target, config) {
            var recurse = true; // set true so childList we'll always check the first level
            return (function copy($target) {
                var elestruct = {
                    /** @type {Node} */
                    node: $target
                };

                // Store current character data of target text or comment node if the config requests
                // those properties to be observed.
                if (config.charData && ($target.nodeType === 3 || $target.nodeType === 8)) {
                    elestruct.charData = $target.nodeValue;
                }
                // its either a element, comment, doc frag or document node
                else {
                    // Add attr only if subtree is specified or top level and avoid if
                    // attributes is a document object (#13).
                    if (config.attr && recurse && $target.nodeType === 1) {
                        /**
                         * clone live attribute list to an object structure {name: val}
                         * @type {Object.<string, string>}
                         */
                        elestruct.attr = reduce($target.attributes, function (memo, attr) {
                            if (!config.afilter || config.afilter[attr.name]) {
                                memo[attr.name] = getAttributeValue($target, attr);
                            }
                            return memo;
                        }, {});
                    }

                    // whether we should iterate the children of $target node
                    if (recurse && ((config.kids || config.charData) || (config.attr && config.descendents))) {
                        /** @type {Array.<!Object>} : Array of custom clone */
                        elestruct.kids = map($target.childNodes, copy);
                    }

                    recurse = config.descendents;
                }
                return elestruct;
            })($target);
        }

        /**
         * indexOf an element in a collection of custom nodes
         *
         * @param {NodeList} set
         * @param {!Object} $node : A custom cloned node
         * @param {number} idx : index to start the loop
         * @return {number}
         */
        function indexOfCustomNode(set, $node, idx) {
            return indexOf(set, $node, idx, JSCompiler_renameProperty("node"));
        }

        // using a non id (eg outerHTML or nodeValue) is extremely naive and will run into issues with nodes that may appear the same like <li></li>
        var counter = 1; // don't use 0 as id (falsy)
        /** @const */
        var expando = "mo_id";

        /**
         * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
         *
         * @param {Node} $ele
         * @return {(string|number)}
         */
        function getElementId($ele) {
            try {
                return $ele.id || ($ele[expando] = $ele[expando] || counter++);
            } catch (o_O) { // ie <8 will throw if you set an unknown property on a text node
                try {
                    return $ele.nodeValue; // naive
                } catch (shitie) { // when text node is removed: https://gist.github.com/megawac/8355978 :(
                    return counter++;
                }
            }
        }

        /**
         * **map** Apply a mapping function to each item of a set
         * @param {Array|NodeList} set
         * @param {Function} iterator
         */
        function map(set, iterator) {
            var results = [];
            for (var index = 0; index < set.length; index++) {
                results[index] = iterator(set[index], index, set);
            }
            return results;
        }

        /**
         * **Reduce** builds up a single result from a list of values
         * @param {Array|NodeList|NamedNodeMap} set
         * @param {Function} iterator
         * @param {*} [memo] Initial value of the memo.
         */
        function reduce(set, iterator, memo) {
            for (var index = 0; index < set.length; index++) {
                memo = iterator(memo, set[index], index, set);
            }
            return memo;
        }

        /**
         * **indexOf** find index of item in collection.
         * @param {Array|NodeList} set
         * @param {Object} item
         * @param {number} idx
         * @param {string} [prop] Property on set item to compare to item
         */
        function indexOf(set, item, idx, prop) {
            for (/*idx = ~~idx*/; idx < set.length; idx++) {// start idx is always given as this is internal
                if ((prop ? set[idx][prop] : set[idx]) === item) return idx;
            }
            return -1;
        }

        /**
         * @param {Object} obj
         * @param {(string|number)} prop
         * @return {boolean}
         */
        function has(obj, prop) {
            return obj[prop] !== undefined; // will be nicely inlined by gcc
        }

        // GCC hack see https://stackoverflow.com/a/23202438/1517919
        function JSCompiler_renameProperty(a) {
            return a;
        }

        return MutationObserver;
    })(void 0);
}
