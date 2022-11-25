import VueIcon from '@ant-design/icons-vue';

export function setTwoToneColor(primaryColor) {
  return VueIcon.setTwoToneColors({
    primaryColor: primaryColor
  });
}

export function getTwoToneColor() {
  var colors = VueIcon.getTwoToneColors();
  return colors.primaryColor;
}