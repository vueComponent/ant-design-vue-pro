<template>
    <div class="footer">
        <div class="links">
            <a href="#">Pro 首页</a>
            <a href="#"><a-icon type="github"/></a>
            <a href="#">Ant Design</a>
        </div>
        <div class="copyright">
            Copyright <a-icon type="copyright" /> 2018 <span>白鹭学园技术组出品</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "LayoutFooter"
  }
</script>

<style lang="scss" scoped>
    .footer {
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
            margin-bottom: 8px;

            a {
                color: rgba(0,0,0,.45);

                &:hover {
                    color: rgba(0,0,0,.65);
                }

                &:not(:last-child) {
                    margin-right: 40px;
                }
            }
        }
        .copyright {
            color: rgba(0,0,0,.45);
            font-size: 14px;
        }
    }
</style>