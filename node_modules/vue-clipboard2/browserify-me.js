var VueClipboard = require('./vue-clipboard.js')

global.VueClipboard = VueClipboard

window.Vue && global.Vue.use(VueClipboard)
