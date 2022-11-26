'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetRect = getTargetRect;
exports.getFixedTop = getFixedTop;
exports.getFixedBottom = getFixedBottom;
exports.getObserverEntities = getObserverEntities;
exports.addObserveTarget = addObserveTarget;
exports.removeObserveTarget = removeObserveTarget;

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
}

function getFixedTop(placeholderReact, targetRect, offsetTop) {
  if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
    return offsetTop + targetRect.top + 'px';
  }
  return undefined;
}

function getFixedBottom(placeholderReact, targetRect, offsetBottom) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    var targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset + 'px';
  }
  return undefined;
}

// ======================== Observer ========================
var TRIGGER_EVENTS = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

var observerEntities = [];

function getObserverEntities() {
  // Only used in test env. Can be removed if refactor.
  return observerEntities;
}

function addObserveTarget(target, affix) {
  if (!target) return;

  var entity = observerEntities.find(function (item) {
    return item.target === target;
  });

  if (entity) {
    entity.affixList.push(affix);
  } else {
    entity = {
      target: target,
      affixList: [affix],
      eventHandlers: {}
    };
    observerEntities.push(entity);

    // Add listener
    TRIGGER_EVENTS.forEach(function (eventName) {
      entity.eventHandlers[eventName] = (0, _addEventListener2['default'])(target, eventName, function () {
        entity.affixList.forEach(function (targetAffix) {
          targetAffix.lazyUpdatePosition();
        });
      });
    });
  }
}

function removeObserveTarget(affix) {
  var observerEntity = observerEntities.find(function (oriObserverEntity) {
    var hasAffix = oriObserverEntity.affixList.some(function (item) {
      return item === affix;
    });
    if (hasAffix) {
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(function (item) {
        return item !== affix;
      });
    }
    return hasAffix;
  });

  if (observerEntity && observerEntity.affixList.length === 0) {
    observerEntities = observerEntities.filter(function (item) {
      return item !== observerEntity;
    });

    // Remove listener
    TRIGGER_EVENTS.forEach(function (eventName) {
      var handler = observerEntity.eventHandlers[eventName];
      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
}