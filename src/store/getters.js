const getters = {
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters
}

export default getters