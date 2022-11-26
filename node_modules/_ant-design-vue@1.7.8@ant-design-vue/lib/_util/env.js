'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-undef */
// Browser environment sniffing
var inBrowser = exports.inBrowser = typeof window !== 'undefined';
var inWeex = exports.inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = exports.weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = exports.UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = exports.isIE = UA && /msie|trident/.test(UA);
var isIE9 = exports.isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = exports.isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = exports.isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = exports.isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = exports.isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = exports.isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = exports.isFF = UA && UA.match(/firefox\/(\d+)/);