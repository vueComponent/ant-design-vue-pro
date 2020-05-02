import Vue from 'vue'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import PermissionHelper from '@/utils/helper/permission'
// import '@/components/use'
import './directives/action'

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueClipboard)
Vue.use(PermissionHelper)
Vue.use(VueCropper)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')
