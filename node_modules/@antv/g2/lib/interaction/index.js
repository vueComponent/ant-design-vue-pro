/**
 * @fileOverview Interaction
 * @author leungwensen@gmail.com
 */
var G2 = require('../core');

var Chart = require('../chart/chart');

var Util = require('../util');

var Interactions = {
  Base: require('./base'),
  Brush: require('./brush'),
  Drag: require('./drag'),
  ScrollBar: require('./scroll-bar'),
  ShapeSelect: require('./shape-select'),
  Slider: require('./slider'),
  Zoom: require('./zoom')
};
G2._Interactions = {};

G2.registerInteraction = function (type, constructor) {
  G2._Interactions[type] = constructor;
};

G2.getInteraction = function (type) {
  return G2._Interactions[type];
}; // binding on View


Chart.prototype.getInteractions = function () {
  var me = this;

  if (!me._interactions) {
    me._interactions = {};
  }

  return me._interactions;
};

Chart.prototype._setInteraction = function (type, interaction) {
  var me = this;
  var interactions = me.getInteractions();

  if (interactions[type] && interactions[type] !== interaction) {
    // only one interaction for a key
    interactions[type].destroy();
  }

  interactions[type] = interaction;
};

Chart.prototype.clearInteraction = function (type) {
  var me = this;
  var interactions = me.getInteractions();

  if (type) {
    if (interactions[type]) {
      interactions[type]._reset();

      interactions[type].destroy();
    }

    delete interactions[type];
  } else {
    Util.each(interactions, function (interaction, key) {
      interaction._reset();

      interaction.destroy();
      delete interactions[key];
    });
  }
};

Chart.prototype.interact = Chart.prototype.interaction = function (type, cfg) {
  var me = this;
  var Ctor = G2.getInteraction(type);
  var interaction = new Ctor(cfg, me);

  me._setInteraction(type, interaction);

  return me;
};

G2.registerInteraction('brush', Interactions.Brush);
G2.registerInteraction('Brush', Interactions.Brush);
G2.registerInteraction('drag', Interactions.Drag);
G2.registerInteraction('Drag', Interactions.Drag);
G2.registerInteraction('zoom', Interactions.Zoom);
G2.registerInteraction('Zoom', Interactions.Zoom);
G2.registerInteraction('scroll-bar', Interactions.ScrollBar);
G2.registerInteraction('ScrollBar', Interactions.ScrollBar);
G2.registerInteraction('shape-select', Interactions.ShapeSelect);
G2.registerInteraction('ShapeSelect', Interactions.ShapeSelect);
G2.registerInteraction('slider', Interactions.Slider);
G2.registerInteraction('Slider', Interactions.Slider);
module.exports = Interactions;