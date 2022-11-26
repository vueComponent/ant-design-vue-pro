function enhancer(Component) {
  return {
    mixins: [Component],
    updated: function updated() {
      var _this = this;

      var now = Date.now();
      var updated = false;

      Object.keys(this.paths).forEach(function (key) {
        var path = _this.paths[key];

        if (!path) {
          return;
        }

        updated = true;
        var pathStyle = path.style;
        pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';

        if (_this.prevTimeStamp && now - _this.prevTimeStamp < 100) {
          pathStyle.transitionDuration = '0s, 0s';
        }
      });
      if (updated) {
        this.prevTimeStamp = Date.now();
      }
    }
  };
}

export default enhancer;