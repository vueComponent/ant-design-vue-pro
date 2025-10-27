业务组件 (features/)
定位：与具体业务逻辑强绑定，按模块划分。

命名规则：

模块文件夹名：业务模块名（如 user, order）

组件文件名：PascalCase + 功能描述（如 UserCard.vue）

示例：
features/
  user/
    UserCard.vue     # 用户卡片组件
    UserList.vue     # 用户列表组件
    index.ts
    types.ts       # 类型定义