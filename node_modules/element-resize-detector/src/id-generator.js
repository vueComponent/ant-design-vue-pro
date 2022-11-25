"use strict";

module.exports = function() {
    var idCount = 1;

    /**
     * Generates a new unique id in the context.
     * @public
     * @returns {number} A unique id in the context.
     */
    function generate() {
        return idCount++;
    }

    return {
        generate: generate
    };
};
