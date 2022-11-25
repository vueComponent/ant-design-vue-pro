## 使用 注意： 需要关掉本地的mock服务， 不然图片转化会报错 
```
组件内使用
import { VueCropper }  from 'vue-cropper' 
components: {
  VueCropper,
},

main.js里面使用
import VueCropper from 'vue-cropper' 

Vue.use(VueCropper)

cdn方式使用
<script src="vuecropper.js"></script>
Vue.use(window['vue-cropper'])

nuxt 使用方式
if(process.browser) {
  vueCropper = require('vue-cropper')
  Vue.use(vueCropper.default)
}

```

``` html
<vueCropper
  ref="cropper"
  :img="option.img"
  :outputSize="option.size"
  :outputType="option.outputType"
></vueCropper>
```


## vue-cropper
### 一个优雅的图片裁剪插件
 [预览](http://xyxiao.cn/vue-cropper/example/)
 [english](https://github.com/xyxiao001/vue-cropper/blob/master/english.md)

### vue-cropper 相关文章参考。
#### [vue全家桶开发管理后台—裁切图片](https://blog.csdn.net/qq_30632003/article/details/79639346)   作者： 麻球科技-菅双鹏
#### [Vue-cropper 图片裁剪的基本原理](https://www.cnblogs.com/tugenhua0707/p/8859291.html)  作者： 龙恩0707
#### [关于昵称和头像的总结（模仿微信）](https://zhuanlan.zhihu.com/p/45746753)  作者： 秋晨光

### vue-cropper 交流。
##### 有什么意见,或者bug  或者想一起开发vue-cropper， 或者想一起开发其他插件
![](https://qn-qn-kibey-static-cdn.app-echo.com/4C6FE9E2-3D06-402B-8F32-98B82BEBDD9F.png)

# vue-cropper

#### 安装 
```
npm install vue-cropper

yarn add vue-cropper
```





### 如果你没有使用npm
[在线例子](https://codepen.io/xyxiao001/pen/wxwKGz)

### 服务器渲染 nuxt 解决方案 设置为ssr: false
```
module.exports = {
  ...
  build: {
    vendor: [
      'vue-cropper
    ...
    plugins: [
      { src: '~/plugins/vue-cropper', ssr: false }
    ]
  }
}
```

###  目前还不知道什么原因项目里面开启mock 会导致file报错, 建议使用时 关掉mock


<table style="text-align: center">
  <thead>
    <tr>
        <td>名称</td>
        <td>功能</td>
        <td>默认值</td>
        <td>可选值</td>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>img</td>
        <td>裁剪图片的地址</td>
        <td>空</td>
        <td>url 地址 || base64 || blob</td>
    </tr>
    <tr>
        <td>outputSize</td>
        <td>裁剪生成图片的质量</td>
        <td>1</td>
        <td>0.1 - 1</td>
    </tr>
    <tr>
        <td>outputType</td>
        <td>裁剪生成图片的格式</td>
        <td>jpg (jpg 需要传入jpeg)</td>
        <td>jpeg || png || webp</td>
    </tr>
    <tr>
        <td>info</td>
        <td>裁剪框的大小信息</td>
        <td>true</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>canScale</td>
        <td>图片是否允许滚轮缩放</td>
        <td>true</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>autoCrop</td>
        <td>是否默认生成截图框</td>
        <td>false</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>autoCropWidth</td>
        <td>默认生成截图框宽度</td>
        <td>容器的80%</td>
        <td>0~max</td>
    </tr>
    <tr>
        <td>autoCropHeight</td>
        <td>默认生成截图框高度</td>
        <td>容器的80%</td>
        <td>0~max</td>
    </tr>
    <tr>
        <td>fixed</td>
        <td>是否开启截图框宽高固定比例</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>fixedNumber</td>
        <td>截图框的宽高比例</td>
        <td>[1, 1]</td>
        <td>[宽度, 高度]</td>
    </tr>
    <tr>
        <td>full</td>
        <td>是否输出原图比例的截图</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>fixedBox</td>
        <td>固定截图框大小 不允许改变</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>canMove</td>
        <td>上传图片是否可以移动</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>canMoveBox</td>
        <td>截图框能否拖动</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>original</td>
        <td>上传图片按照原始比例渲染</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>centerBox</td>
        <td>截图框是否被限制在图片里面</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
	<tr>
        <td>high</td>
        <td>是否按照设备的dpr 输出等比例图片</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>infoTrue</td>
        <td>true 为展示真实输出图片宽高  false 展示看到的截图框宽高</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>maxImgSize</td>
        <td>限制图片最大宽度和高度</td>
        <td>2000</td>
        <td>0-max</td>
    </tr>
    <tr>
        <td>enlarge</td>
        <td>图片根据截图框输出比例倍数</td>
        <td>1</td>
        <td>0-max(建议不要太大不然会卡死的呢)</td>
    </tr>
    <tr>
        <td>mode</td>
        <td>图片默认渲染方式</td>
        <td>contain</td>
        <td>contain , cover, 100px, 100% auto</td>
    </tr>
  </tbody>
</table>


### 内置方法  通过this.$refs.cropper 调用
##### this.$refs.cropper.startCrop()  开始截图
##### this.$refs.cropper.stopCrop()  停止截图
##### this.$refs.cropper.clearCrop()  清除截图
##### this.$refs.cropper.changeScale()  修改图片大小 正数为变大 负数变小
##### this.$refs.cropper.getImgAxis() 获取图片基于容器的坐标点
##### this.$refs.cropper.getCropAxis() 获取截图框基于容器的坐标点
##### this.$refs.cropper.goAutoCrop 自动生成截图框函数
##### this.$refs.cropper.rotateRight() 向右边旋转90度
##### this.$refs.cropper.rotateLeft() 向左边旋转90度

####  图片加载的回调 imgLoad  返回结果success,  error

####  获取截图信息
this.$refs.cropper.cropW  截图框宽度

this.$refs.cropper.cropH 截图框高度
``` js
// 获取截图的base64 数据
this.$refs.cropper.getCropData((data) => {
  // do something
  console.log(data)  
})

// 获取截图的blob数据
this.$refs.cropper.getCropBlob((data) => {
  // do something
  console.log(data)  
})

### Description of the default rendering mode of the image
Image layout mode mode achieves the same effect as css background
Contain Centered layout Default does not scale Ensure the image is inside the container mode: 'contain'
Cover stretch layout fill the entire container mode: 'cover'
If only one value is given, this value will be used as the width value and the height value will be set to auto. mode: '50px'
If two values are given, the first one will be the width value and the second will be the height value. mode: '50px 60px'

### 预览
``` html
@realTime="realTime"
// Real time preview function
realTime(data) {
  var previews = data;
  var h = 0.5;
  var w = 0.2;

  this.previewStyle1 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: h
  };

  this.previewStyle2 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: w
  };

  固定为100宽度
  this.previewStyle3 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: 100 / preview.w
  };

  固定为100高度
  this.previewStyle4 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: 100 / preview.h
  };
  this.previews = data;
},


<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="option.img" :style="previews.img">
  </div>
</div>
<p>中等大小</p>
<div :style="previewStyle1"> 
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>

<p>迷你大小</p>
<div :style="previewStyle2"> 
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>
=
```

#### 图片移动回调函数 @imgMoving
```
data type
{
   moving: true, // moving 是否在移动
   axis: {
    x1: 1, // 左上角
	 x2: 1，// 右上角
	 y1: 1，// 左下角
	 y2: 1 // 右下角
   }
 }
```

#### 截图框移动回调函数 @cropMoving
```
data type
{
   moving: true, // moving 是否在移动
   axis: {
    x1: 1, // 左上角
	 x2: 1，// 右上角
	 y1: 1，// 左下角
	 y2: 1 // 右下角
   }
 }
```


## 更新日志


### 0.49
修复滚轮默认事件问题
修复html静态文件引入事件触发问题

### 0.48
修复mode 属性 contain 和cover的显示bug问题

修复ios 下面base64图片跨域显示问题


### 0.47
修复第一次不触发预览的问题
新增加图片渲染mode功能

### 0.46
修复图片旋转bug
修复显示的一些bug

### 0.45 
添加倍数使用 enlarge
可以输出裁剪框等比例图片；

感谢来自于 [](https://github.com/hzsrc)的贡献
添加预览框各种比例, 和修复图片截图小数问题

### 0.44
修复引入方式的问题
```
组件内使用
import { VueCropper }  from vue-cropper 
components: {
  VueCropper,
},

main.js里面使用
import VueCropper from vue-cropper 

Vue.use(vueCropper)

cdn方式使用
<script src="vuecropper.js"></script>
Vue.use(window['vue-cropper'])
```
### v0.43
剥离exif的依赖库, 添加exfi-min.js减小代码体积  45.9k => 37k
build 升级webpack4 升级
```
添加vue install 方法  =》  npm: Vue.use(VueCropper)  web: Vue.use(window['vue-cropper'])
```


### v0.42
修复截图框因为去除小数点的引起的问题

### v0.41
修复截图框边界问题


### v0.40
修复orientation的处理方式
感谢 [Felipe Mengatto](https://github.com/felipemengatto)的贡献

### v0.39
修复orientation值不同带来的问题
感谢 [Felipe Mengatto](https://github.com/felipemengatto)的贡献

### v0.38
```
修改坐标反馈问题
```


### v0.37
```
修复centerBox 的截图超出1px问题
添加截图  图片移动触发事件
```

### v0.36
```
修复旋转自动生成截图框的错误
修改autocrop  可以动态生成截图框
```

### v0.35
```
修复其他图片没有压缩的问题
```

### v0.34
```提供移动端崩溃的解决方案
修改maxImgSize为2000
```

### v0.33
```提供移动端崩溃的解决方案
maxImgSize 限制图片最大宽度和高度 默认为2000px
```

### v0.32
```
新增截图框信息展示
infoTrue  true 为展示真实输出图片宽高  false 展示看到的截图框宽高
```

### v0.30
```
新增获取图片坐标函数  this.$refs.cropper.getImgAxis()
新增获取截图框坐标函数  this.$refs.cropper.getCropAxis()
新增对高清设备的兼容  high
新增截图框限制在图片以内的功能  centerbox
新增自动生成截图框函数 this.$refs.cropper.goAutoCrop
```

### v0.29
新增图片加载的回调 imgLoad  返回结果success,  error
### v0.28
修复截图框固定 截图框会影响原图移动 缩放
### v0.27
鼠标缩放问题优化
img max-width 样式优化
新增属性  
canMove  是否可以移动图片   默认为是
canMoveBox 是否可以移动截图框  默认为是
original  是否按图片原始比例渲染  默认为否


### v0.26
修复火狐浏览器 鼠标缩放问题

### v0.25
修复图片有可能不展示

### v0.24
修复ios拍照旋转 截图问题 添加自动修复图片 截图预览代码变更, 修改默认上传图片为blob预览
``` html
realTime (data) {
  this.previews = data
}
<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>
```


### v0.23
小优化
### v0.22
 新增修改图片大小函数 通过this.$refs.cropper.changeScale 调用

### v0.21
新增固定截图框大小fiexdBox(注： 最好搭配自动生成截图框使用)

### v0.20
新增输出原图比例截图 props名full,  修复缩放图片过大灵敏度问题

### v0.19 
新增图片旋转 修复mac滚轮过度灵敏
``` js
this.$refs.cropper.rotateRight() // 向右边旋转90度
this.$refs.cropper.rotateLeft() // 向左边旋转90度
```

### v0.18
修复默认生成截图框超过容器错误
### v0.17 
修复blob数据获取错误
### v0.15 
添加手机端手势缩放
```
canScale: true
```

### v0.13 
添加预览
``` html
@realTime="realTime"
// Real time preview function
realTime (data) {
  this.previews = data
}
<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="option.img" :style="previews.img">
  </div>
</div>
```
