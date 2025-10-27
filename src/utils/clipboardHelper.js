import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);

export function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        Vue.prototype.$copyText(text).then(() => {
            resolve(); // 成功回调
        }).catch(err => {
            // console.error('Failed to copy text: ', err);
            reject(err); // 失败回调
        });
    });
}