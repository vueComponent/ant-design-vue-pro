const getters = {
  device: state => state.app.device,
  token: state => state.user.token,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters
}

export default getters