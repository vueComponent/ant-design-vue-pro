import Slider from './Slider';
export default (function (config) {
    var plugins = {};
    for (var pluginName in config) {
        if (config.hasOwnProperty(pluginName)) {
            var pluginConfig = config[pluginName];
            switch (pluginName) {
                case 'slider':
                    plugins.slider = Slider(pluginConfig);
                    break;
                default:
                    break;
            }
        }
    }
    return plugins;
});
//# sourceMappingURL=index.js.map