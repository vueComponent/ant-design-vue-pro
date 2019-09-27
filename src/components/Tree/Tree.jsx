import { Menu, Icon, Input } from 'ant-design-vue'
import _ from 'lodash'
const { Item, ItemGroup, SubMenu } = Menu
const { Search } = Input
export default {
  name: 'Tree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    },
    treeTitle: {
      type: String,
      default: ''
    },
    defaultSelectedKeys:{
      type: Array,
      default: () => []
    },
  },
  created () {
    
  },
  activated() {
    this.selectedKeys = this.defaultSelectedKeys
  },
  data () {
    return {
      localOpenKeys: [],
      selectedKeys:[]
    }
  },
  methods: {
    handlePlus (item) {
      this.$emit('add', item)
    },
    clickItem(item){
      this.selectedKeys=[item.key]
      this.$emit('click', item)
    },
    handleTitleClick (...args) {
      this.$emit('titleClick', { args })
    },
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.localOpenKeys.indexOf(key) === -1)
      const dataSource=[];
        _.each(this.dataSource,function(item) {
          if(item.childList){
            dataSource.push(item.basisMarkId)
          }
       }) 
      if (dataSource.indexOf(latestOpenKey) === -1) {
        this.localOpenKeys = openKeys
      } else {
        this.localOpenKeys = latestOpenKey ? [latestOpenKey] :[]
      }
    },
    renderSearch () {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    },
    renderIcon (icon) {
      return icon && (<Icon type={icon} />) || null
    },
    renderTreeIcon(percentage){
      if(parseInt(percentage)==0||!percentage||percentage=='') return (<i class="placeholderI"></i>)
      if(parseInt(percentage)<100) return (<Icon type="clock-circle" theme="filled" />)
      if(parseInt(percentage)==100) return (<Icon type="check-circle" theme="filled" />)
    },
    renderMenuItem (item) {
      return (
        <Item key={item.basisMarkId}>
          <div style="padding-left:20px;">
          {this.renderTreeIcon(item.progress)}
          { this.renderIcon(item.icon) }
          <span class="treeSubTitle">{ item.basisMarkName }</span>
          <span class="treeSubPercentage">{parseInt(item.progress)>0?parseInt(item.progress)+"%":item.progress}</span>
          </div>
        </Item>
      )
    },
    renderItem (item) {
      return item.childList ? this.renderSubItem(item, item.basisMarkId) : this.renderMenuItem(item, item.basisMarkId)
    },
    renderItemGroup (item) {
      const childrenItems = item.childList.map(o => {
        return this.renderItem(o, o.basisMarkId)
      })

      return (
        <ItemGroup key={item.basisMarkId}>
          <template slot="title">
            <span>{ item.basisMarkName }</span>
            <a-dropdown>
              <a class="btn"><a-icon type="ellipsis" /></a>
              <a-menu slot="overlay">
                <a-menu-item key="1">新增</a-menu-item>
                <a-menu-item key="2">合并</a-menu-item>
                <a-menu-item key="3">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          { childrenItems }
        </ItemGroup>
      )
    },
    renderSubItem (item, key) {
      const childrenItems = item.childList && item.childList.map(o => {
        return this.renderItem(o, o.basisMarkId)
      })

      const title = (
        <span slot="title" style="padding-left:20px;">
          {this.renderTreeIcon(item.percentage)}
          { this.renderIcon(item.icon) }
          <span class="treeSubTitle">{ item.basisMarkName }</span>
          <span class="treeSubPercentage">{parseInt(item.percentage)==0?'':item.percentage}</span>
        </span>
      )

      if (item.group) {
        return this.renderItemGroup(item)
      }
      // titleClick={this.handleTitleClick(item)}
      return (
        <SubMenu key={key}>
          { title }
          { childrenItems }
        </SubMenu>
      )
    }
  },
  watch:{
    dataSource(newValue,old){
       const  newData=[];
       const that=this;
       if(this.defaultSelectedKeys.length==0){
         this.selectedKeys=[newValue[0].basisMarkId]
         return  false
       }
       _.each(newValue,function(item){
          newData.push(item.basisMarkId)
       })
      if(newData.indexOf(this.defaultSelectedKeys[0])>-1){
          this.selectedKeys=this.defaultSelectedKeys;
      }else{
         _.each(newValue,function(item){
           if(item.childList){
             const childList=[]
             _.each(item.childList,function(v){
               childList.push(v.basisMarkId)
             })
             if(childList.indexOf(that.defaultSelectedKeys[0])>-1){
                that.selectedKeys=that.defaultSelectedKeys;
                that.localOpenKeys=[item.basisMarkId];
                return false
             }
           }
        })
      }
    }
  },
  render () {
    const { dataSource, search, treeTitle } = this.$props

   //  // this.localOpenKeys =this.openKeys.slice(0)
   console.log("确定",this.localOpenKeys)
    const list = dataSource.map(item => {
      return this.renderItem(item)
    })

    return (
      <div class="tree-wrapper">
        { search ? this.renderSearch() : null }
        <div class="tree-title">{ treeTitle }</div>
        <Menu mode="inline" inlineIndent={0} class="custom-tree"  {...{ on: { click: this.clickItem,openChange:this.onOpenChange } }} selectedKeys={this.selectedKeys} openKeys={this.localOpenKeys}>
          { list }
        </Menu>
      </div>
    )
  }
}
