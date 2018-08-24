// import table from './datatable.vue';
// import table from './table.vue';
// export default table;



import T from "ant-design-vue/es/table/Table";
export default {
  data() {
    return {
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
    this.loadData();
  },
  methods: {
    refresh() {
      this.loadData();
    },
    loadData(pagination, filters, sorter) {
      var result = this.data(
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
            current: r.current_page, //current: r.pageNo,
            total: r.total, //total: r.totalCount,            
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          });
          this.localDataSource = r.data; // this.localDataSource = r.result;
        });
      }
    }
  },
  render(h) {
    var _vm = this

    var props = {},
      localKeys = Object.keys(this.$data);

    Object.keys(T.props).forEach(k => {
      var localKey = `local${k.substring(0,1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        return props[k] = _vm[localKey];
      }
      return props[k] = _vm[k];
    })

    return h("a-table", {
      tag: "component",
      attrs: props,
      on: {
        change: _vm.loadData
      },
      scopedSlots: this.$scopedSlots
    });
  }
};
