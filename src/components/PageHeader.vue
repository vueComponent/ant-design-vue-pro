<template>
    <div class="page-header">

        <s-breadcrumb></s-breadcrumb>

        <div class="detail">
            <div v-if="avatar" class="avatar"><a-avatar :src="avatar" /></div>
            <div class="main">
                <div class="row">
                    <img v-if="logo" :src="logo" class="logo" />
                    <h1 v-if="title" class="title">{{ title }}</h1>
                    <div class="action"><slot name="action"></slot></div>
                </div>
                <div class="row">
                    <div v-if="this.$slots.content" class="content"><slot name="content"></slot></div>
                    <div v-if="this.$slots.extra" class="extra"><slot name="extra"></slot></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    name: "PageHeader",
    components: {
      "s-breadcrumb": Breadcrumb
    },
    props: {
      title: {
        type: String,
        required: false
      },
      breadcrumb: {
        type: Array,
        required: false
      },
      logo: {
        type: String,
        required: false
      },
      avatar: {
        type: String,
        required: false
      }
    }
  }
</script>

<style lang="scss" scoped>
    .page-header {
        background: #fff;
        padding: 16px 32px 0;
        border-bottom: 1px solid #e8e8e8;

        .breadcrumb {
            margin-bottom: 16px;
        }

        .detail {
            display: flex;

            .avatar {
                flex: 0 1 72px;
                margin: 0 24px 8px 0;
                & > span {
                    border-radius: 72px;
                    display: block;
                    width: 72px;
                    height: 72px;
                }
            }

            .main {
                width: 100%;
                flex: 0 1 auto;

                .row {
                    display: flex;
                    width: 100%;
                }

                .title {
                    font-size: 20px;
                    font-weight: 500;
                }
                .logo {
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    margin-right: 16px;
                }
                .content {
                    margin-bottom: 16px;
                    flex: auto;
                }
                .extra {
                    flex: 0 1 auto;
                    margin-left: 88px;
                    min-width: 242px;
                    text-align: right;
                }
                .action {
                    margin-left: 56px;
                    min-width: 266px;
                    flex: 0 1 auto;
                    text-align: right;
                }
            }
        }
    }
</style>