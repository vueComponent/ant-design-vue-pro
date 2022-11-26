import isMobile from './';

/**
 * This file is used to generate the browser version of this library.
 * It is compiled as `isMobile.min.js` into the `dist` directory.
 *
 * The `dist` directory is published to NPM so that the compiled file can
 * can be easily accessed by consumers of the library via the jsDelivr CDN.
 *
 * It is meant to be included via a `<script>` tag and will execute
 * immediately, assigning its result to the `isMobile` global variable.
 */

exports = isMobile();
