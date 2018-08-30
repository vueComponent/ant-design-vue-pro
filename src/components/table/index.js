import T from "ant-design-vue/es/table/Table";
export default {
  data() {
    return {
      needTotalList: [],
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, T.props.pagination)
    };
  },
  props: Object.assign({}, T.props, {
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.$router.push({
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        }),
      });
    },
    pageNum(val) {
      this.localPagination = Object.assign({}, this.localPagination, {
        current: val
      });
    },
    pageSize(val) {
      this.localPagination = Object.assign({}, this.localPagination, {
        pageSize: val
      });
    },
    showSizeChanger(val) {
      this.localPagination = Object.assign({}, this.localPagination, {
        showSizeChanger: val
      });
    }
  },
  created() {
    this.localPagination = Object.assign({}, this.localPagination, {
      current: this.pageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    });

    this.needTotalList = this.initTotalList(this.columns)

    this.loadData();
  },
  methods: {
    refresh() {
      this.loadData();
    },
    loadData(pagination, filters, sorter) {
      this.localLoading = true
      const result = this.data(
        Object.assign({
            pageNo:
              (pagination && pagination.current) ||
              this.localPagination.current,
            pageSize:
              (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          },
          (sorter && sorter.field && {
            sortField: sorter.field
          }) || {},
          (sorter && sorter.order && {
            sortOrder: sorter.order
          }) || {}, {
            ...filters
          }
        )
      );

      if (result instanceof Promise) {
        result.then(r => {
          this.localPagination = Object.assign({}, this.localPagination, {
            current: r.pageNo,  // 返回结果中的当前分页数
            total: r.totalCount, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          });
          this.localDataSource = r.data; // 返回结果中的数组数据
          this.localLoading = false
        }).catch(() => {
          this.localLoading = false
        });
      }
    },
    initTotalList (columns) {
      const totalList = []
      columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({ ...column, total: 0 })
        }
      })
      return totalList
    },
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      let list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
      this.$emit('change', selectedRowKeys, selectedRows)
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.updateSelect([], [])
    },
    renderMsg(h) {
      let d = this.needTotalList.map(item => {
        return h('span', `${item.title} 总计 ${item.customRender ? item.customRender(item.total) : item.total}`)
      })
      return d
    },
    renderAlert(h) {

      return h('span', {
        slot: 'message'
      }, this.renderMsg(h))
    }
  },
  render(h) {
    const _vm = this

    let props = {},
      localKeys = Object.keys(this.$data);

    Object.keys(T.props).forEach(k => {
      let localKey = `local${k.substring(0,1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        return props[k] = _vm[localKey];
      }
      return props[k] = _vm[k];
    })

    /*return h("a-table", {
      tag: "component",
      attrs: props,
      on: {
        change: _vm.loadData
      },
      scopedSlots: this.$scopedSlots
    });*/

    return h('div', {

    }, [
      h("a-alert", {
        style: {
          marginBottom: '16px'
        },
        props: {
          type: 'info',
          showIcon: true
        }
      }, [ _vm.renderAlert(h) ]),
      h("a-table", {
        tag: "component",
        attrs: props,
        on: {
          change: _vm.loadData
        },
        scopedSlots: this.$scopedSlots
      })
    ]);


  }
};
