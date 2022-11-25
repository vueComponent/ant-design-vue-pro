"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDocumentTitle = void 0;

var setDocumentTitle = function setDocumentTitle(title) {
  document.title = title;
  var ua = navigator.userAgent; // eslint-disable-next-line

  var regex = /\bMicroMessenger\/([\d\.]+)/;

  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    var i = document.createElement('iframe');
    i.src = '/favicon.ico';
    i.style.display = 'none';

    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 9);
    };

    document.body.appendChild(i);
  }
};

exports.setDocumentTitle = setDocumentTitle;