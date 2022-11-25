/**
 * Brings package name to correct format based on prefix
 * @param {string} name The name of the package.
 * @returns {string} Normalized name of the package
 * @private
 */
export declare function normalizePackageName(name: string): string;
/**
 * Removes the prefix from a fullname.
 * @param {string} fullname The term which may have the prefix.
 * @returns {string} The term without prefix.
 */
export declare function getShorthandName(fullname: string): string;
/**
 * Gets the scope (namespace) of a term.
 * @param {string} term The term which may have the namespace.
 * @returns {string} The namepace of the term if it has one.
 */
export declare function getNamespaceFromTerm(term: string): string;
//# sourceMappingURL=plugin-naming.d.ts.map