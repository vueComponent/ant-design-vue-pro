import AvatarList from "./list.vue";
import AvatarListItem from "./item.vue";

const install = function(Vue) {
  Vue.component(AvatarList.name, AvatarList);
  Vue.component(AvatarListItem.name, AvatarListItem);
};
const avatar = { AvatarList, AvatarListItem, install };

export default avatar;
export { AvatarList, AvatarListItem, install };
