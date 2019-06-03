import AvatarList from "./list.vue";
import AvatarListItem from "./item.vue";

const install = function(Vue) {
  Vue.component(AvatarList.name, AvatarList);
  Vue.component(AvatarListItem.name, AvatarListItem);
};
const Avatars = { AvatarList, AvatarListItem, install };

export default Avatars;
export { AvatarList, AvatarListItem, install };
