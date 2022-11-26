/* eslint-disable no-undef */
// Browser environment sniffing
export var inBrowser = typeof window !== 'undefined';
export var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
export var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
export var UA = inBrowser && window.navigator.userAgent.toLowerCase();
export var isIE = UA && /msie|trident/.test(UA);
export var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export var isEdge = UA && UA.indexOf('edge/') > 0;
export var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
export var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
export var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
export var isPhantomJS = UA && /phantomjs/.test(UA);
export var isFF = UA && UA.match(/firefox\/(\d+)/);