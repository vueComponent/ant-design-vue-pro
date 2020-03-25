import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import '@/core/lazy_lib/components_use'
import Viser from 'viser-vue'

// ext library
import VueClipboard from 'vue-clipboard2'
import VueCropper from 'vue-cropper'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import PermissionHelper from '@/utils/helper/permission'
import './directives/action'

VueClipboard.config.autoSetContainer = true

Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
Vue.use(PermissionHelper)
Vue.use(VueCropper)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.')
