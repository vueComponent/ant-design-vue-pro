var assign = require('@antv/util/lib/mix');

var values = require('@antv/util/lib/object/values');

var _partition = require('../util/partition');

var View = require('../view');

assign(View.prototype, {
  partition: function partition(group_by, order_by) {
    if (group_by === void 0) {
      group_by = [];
    }

    if (order_by === void 0) {
      order_by = [];
    }

    return _partition(this.rows, group_by, order_by);
  },
  group: function group(group_by, order_by) {
    var groups = this.partition(group_by, order_by);
    return values(groups);
  },
  groups: function groups(group_by, order_by) {
    return this.group(group_by, order_by);
  }
});