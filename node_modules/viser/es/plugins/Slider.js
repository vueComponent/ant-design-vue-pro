import '@antv/g2';
var Slider = require('@antv/g2-plugin-slider');
export default (function (config) {
    var container = document.getElementById(config.container);
    if (!container) {
        console.error('plugin slider container not defined');
        return;
    }
    container.innerHTML = '';
    var sliderInstance = new Slider(config);
    sliderInstance.render();
    return sliderInstance;
});
//# sourceMappingURL=Slider.js.map