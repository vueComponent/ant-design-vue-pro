import Mock from 'mockjs'

Mock.mock('/api2/user/info','get',{
  status: 200,
  message: '获取用户信息成功',
  result: {
    role: 1,
    name: 'admin',
    avatar: ''
  }
})

Mock.mock('/api2/user/nav','get',{
  status: 200,
  message: '获取用户信息成功',
  data: JSON.stringify([
    {
      parentId: 0,
      name: 'TableList',
      title: 'tableList',
      path: '/',
      meta: {
        title: '测试'
      }
    },
    {
      parentId: 0,
      name: 'PublishArticle111',
      title: 'PublishArticle111',
      component: 'RouteView',
      id: 2,
      meta: {
        title: '运营动态'
      }
    },
    {
      parentId: 2,
      name: 'PublishArticle',
      title: 'PublishArticle',
      component: 'PublishArticle',
      path: '/publishArticle',
      id: 221,
      meta: {
        title: '发布动态'
      }
    },
    {
      parentId: 2,
      name: 'PublishManagement',
      title: 'PublishManagement',
      component: 'PublishManagement',
      path: '/publishManagement',
      id: 222,
      meta: {
        title: '发布管理'
      }
    }
  ])
})