路由/菜单说明
====



格式和说明
----

```javascript
/**
 * 路由配置说明：
 * 建议：sider menu 请不要超过三级菜单，若超过三级菜单，则应该设计为顶部主菜单 配合左侧次级菜单
 *
 **/ 
 {
  hidden: true,
  redirect: noredirect,
  name: 'router-name',
  meta: {
    title: 'title',
    icon: 'svg-name',
    keepAlive: true,
    hiddenPageHeader: true, 
  }
}
```



`{ Route }` 对象

| 参数     | 说明                                      | 类型    | 默认值 |
| -------- | ----------------------------------------- | ------- | ------ |
| hidden   | 控制路由是否显示在 sidebar                | boolean | falase |
| redirect | 重定向地址, 访问这个路由时,自定进行重定向 | string  | -      |
| name     | 路由名称, 建议设置,且不能重名             | string  | -      |
| meta     | 路由元信息（路由附带扩展信息）            | object  | {}     |



`{ Meta }` 对象

| 参数             | 说明                                                         | 类型    | 默认值 |
| ---------------- | ------------------------------------------------------------ | ------- | ------ |
| title            | 路由标题, 用于显示面包屑, 页面标题 *推荐设置                 | string  | -      |
| icon             | 路由在 menu 上显示的图标                                     | string  | -      |
| keepAlive        | 缓存该路由                                                   | boolean | false  |
| hiddenPageHeader | 隐藏 [PageHeader](https://github.com/sendya/ant-design-pro-vue/blob/master/src/components/layout/PageHeader.vue#L14) 组件, *特殊 用于隐藏页面带的 面包屑和页面标题栏 | boolean | false  |
| permission       | 与项目提供的权限拦截匹配的权限，如果不匹配，则会被禁止访问该路由页面 | array   | []     |



路由例子
----

```ecmascript 6
const asyncRouterMap = [
  {
    path: '/dashboard',
    component: Layout,
    name: 'dashboard',
    redirect: '/dashboard/workplace',
    meta: { title: '仪表盘', icon: 'dashboard', permission: [ 'dashboard' ] },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '分析页', hideHeader: true, permission: [ 'dashboard' ] }
      },
      {
        path: '/dashboard/monitor',
        name: 'Monitor',
        hidden: true,
        component: () => import('@/views/dashboard/Monitor'),
        meta: { title: '监控页', hideHeader: true, permission: [ 'dashboard' ] }
      },
      {
        path: '/dashboard/workplace',
        name: 'Workplace',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '工作台', permission: [ 'dashboard' ] }
      }
    ]
  }
]
```

> 请注意 `component: () => import('..') ` 方式引入路由的页面组件为 懒加载模式 
>
> 具体可以看 [Vue 官方文档](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)

