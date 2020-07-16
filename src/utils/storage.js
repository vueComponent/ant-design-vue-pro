import storage from 'store'
import expirePlugin from 'store/plugins/expire'

storage.addPlugin(expirePlugin)

export default storage
