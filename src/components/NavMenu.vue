<template>
    <a-menu
            theme="dark"
            mode="inline"
            :defaultSelectedKeys="['1']">

        <a-sub-menu key="1">
            <span slot="title"><a-icon type="dashboard" /><span>dashboard</span></span>
            <a-menu-item key="11">分析页</a-menu-item>
            <a-menu-item key="12">监控页</a-menu-item>
            <a-menu-item key="13">工作台</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="2">
            <span slot="title"><a-icon type="form" /><span>表单页</span></span>
            <a-menu-item key="21">基础表单</a-menu-item>
            <a-menu-item key="22">分步表单</a-menu-item>
            <a-menu-item key="23">高级表单</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3">
            <span slot="title"><a-icon type="table" /><span>列表页</span></span>
            <a-menu-item key="31">查询表单</a-menu-item>
            <a-menu-item key="32">表单列表</a-menu-item>
            <a-menu-item key="33">卡片列表</a-menu-item>
            <a-sub-menu key="34">
                <span slot="title"><span>搜索列表</span></span>
                <a-menu-item key="341">搜索列表(文章)</a-menu-item>
                <a-menu-item key="342">表单列表(项目)</a-menu-item>
                <a-menu-item key="343">卡片列表(应用)</a-menu-item>
            </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="4">
            <span slot="title"><a-icon type="profile" /><span>详细页</span></span>
            <a-menu-item key="41">基础详情页</a-menu-item>
            <a-menu-item key="42">高级详情页</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="5">
            <span slot="title"><a-icon type="check-circle-o" /><span>结果页</span></span>
            <a-menu-item key="51">成功</a-menu-item>
            <a-menu-item key="52">失败</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="6">
            <span slot="title"><a-icon type="warning" /><span>异常页</span></span>
            <a-menu-item key="61">成功</a-menu-item>
            <a-menu-item key="62">失败</a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>

<script>
  export default {
    name: "Navmenu"
  }
</script>

<style scoped>

</style>