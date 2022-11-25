## vue-cropper
### A simple  picture clipping plugin for vue
 [preview](http://xyxiao.cn/vue-cropper/example/)
 [中文](https://github.com/xyxiao001/vue-cropper)

### Vue-cropper Related Articles Reference.。
#### [vue全家桶开发管理后台—裁切图片](https://blog.csdn.net/qq_30632003/article/details/79639346)   作者： 麻球科技-菅双鹏
#### [Vue-cropper 图片裁剪的基本原理](https://www.cnblogs.com/tugenhua0707/p/8859291.html)  作者： 龙恩0707

### vue-cropper communication.。
##### Any comments, or bugs or want to develop vue-cropper together, or want to develop other plugins together
![](https://qn-qn-kibey-static-cdn.app-echo.com/4C6FE9E2-3D06-402B-8F32-98B82BEBDD9F.png)

# vue-cropper

####   Install
```

npm install vue-cropper
yarn add vue-cropper

```

####   Use 

```
views

import { VueCropper }  from "vue-cropper"
components: {
  VueCropper,
},

main.js

import VueCropper from "vue-cropper" 

Vue.use(VueCropper)

cdn
<script src="vuecropper.js"></script>
Vue.use(window['vue-cropper'])

<vueCropper
  ref="cropper"
  :img="option.img"
  :outputSize="option.size"
  :outputType="option.outputType"
></vueCropper>
```



### not use npm or webpack
[online example](https://codepen.io/xyxiao001/pen/wxwKGz)

### serve render nuxt, control: ssr: false
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


<table style="text-align: center">
  <thead>
    <tr>
        <td>name</td>
        <td>Features</td>
        <td>Detail</td>
        <td>value</td>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>img</td>
        <td>Picture address</td>
        <td>null</td>
        <td>url address || base64 || blob</td>
    </tr>
    <tr>
        <td>outputSize</td>
        <td>Crop the quality of the generated image</td>
        <td>1</td>
        <td>0.1 - 1</td>
    </tr>
    <tr>
        <td>outputType</td>
        <td>Crop the format of the generated image</td>
        <td>jpg (jpg need jpeg)</td>
        <td>jpeg || png || webp</td>
    </tr>
    <tr>
        <td>info</td>
        <td>Crop box size information</td>
        <td>true</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>canScale</td>
        <td>Whether the image allows the wheel to zoom</td>
        <td>true</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>autoCrop</td>
        <td>Whether to generate a screenshot box by default</td>
        <td>false</td>
        <td>true || false</td>
    </tr>
    <tr>
        <td>autoCropWidth</td>
        <td>Default generation of screenshot frame width</td>
        <td>parent's 80%</td>
        <td>0~max</td>
    </tr>
    <tr>
        <td>autoCropHeight</td>
        <td>Default generation of screenshot frame Height</td>
        <td>parent's 80%</td>
        <td>0~max</td>
    </tr>
    <tr>
        <td>fixed</td>
        <td>Whether to open the screenshot frame width and height fixed ratio</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>fixedNumber</td>
        <td>The aspect ratio of the screenshot box</td>
        <td>[1 : 1]</td>
        <td>[width : height]</td>
    </tr>
    <tr>
        <td>full</td>
        <td>Screenshot of whether to output the original map scale</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>fixedBox</td>
        <td>Fixed screenshot frame size is not allowed to change</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>canMove</td>
        <td>Whether the uploaded image can be moved</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>canMoveBox</td>
        <td>Can the screenshot box be dragged?</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>original</td>
        <td>Upload images are rendered in raw scale</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>centerBox</td>
        <td>Is the screenshot box restricted to the image?</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
	<tr>
        <td>high</td>
        <td>Is it proportional to the dpi output of the device?</td>
        <td>true</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>infoTrue</td>
        <td>True to show the true output image width and height false show the width of the screenshot frame</td>
        <td>false</td>
        <td>true | false</td>
    </tr>
    <tr>
        <td>maxImgSize</td>
        <td>Limit the maximum width and height of the image</td>
        <td>2000</td>
        <td>0-max</td>
    </tr>
    <tr>
        <td>enlarge</td>
        <td>Picture output ratio multiplier based on screenshots</td>
        <td>1</td>
        <td>0-max(Don't be too big.)</td>
    </tr>
    <tr>
        <td>mode</td>
        <td>img render mode</td>
        <td>contain</td>
        <td>contain , cover, 100px, 100% auto</td>
    </tr>
  </tbody>
</table>


### Built-in method Called by this.$refs.cropper
##### this.$refs.cropper.startCrop() Start the screenshot
##### this.$refs.cropper.stopCrop() Stop the screenshot
##### this.$refs.cropper.clearCrop() Clear screenshot
##### this.$refs.cropper.changeScale() Modify the image size. The positive number becomes larger. The negative number becomes smaller.
##### this.$refs.cropper.getImgAxis() Get the image based on the container's coordinate points
##### this.$refs.cropper.getCropAxis() Get the screenshot box based on the container's coordinate point
##### this.$refs.cropper.goAutoCrop Automatically generate screenshot box functions
##### this.$refs.cropper.rotateRight() Rotate 90 degrees to the right
##### this.$refs.cropper.rotateLeft() Rotate 90 degrees to the left

#### Image loaded callback imgLoad returns the result success, error

#### Get screenshot information
this.$refs.cropper.cropW screenshot frame width

this.$refs.cropper.cropH screenshot frame height
``` js
// Get the base64 data of the screenshot
this.$refs.cropper.getCropData((data) => {
   // do something
   Console.log(data)
})

// Get the screenshot of the blob data
this.$refs.cropper.getCropBlob((data) => {
   // do something
   Console.log(data)
})
### Preview
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
=
```

#### Image Move Callback Function @imgMoving
```
data type
{
   moving: true, // moving ismove
   axis: {
     x1: 1, // Upper left corner
	 x2: 1，// Upper right corner
	 y1: 1，// Lower left corner
	 y2: 1 // Bottom right corner
   }
 }
```

#### Screenshot box move callback function  @cropMoving
```
data type
{
   moving: true, // moving 是否在移动
   axis: {
     x1: 1, // Upper left corner
	 x2: 1，// Upper right corner
	 y1: 1，// Lower left corner
	 y2: 1 // Bottom right corner
   }
 }
```


## Update log
### 0.47
Fix the problem that does not trigger preview for the first time
New image rendering mode function

### 0.46
Fix image rotation bug
Fix some bugs displayed

### 0.45

Add multiples using enlarge

You can output clipping boxes and other proportional images.



Thank you for your contribution from [https://github.com/hzsrc].

Add preview box to various proportions, and restore image screenshots decimal problem.

### 0.44
修复引入方式的问题
```
Repairing the way of introduction
import { VueCropper }  from vue-cropper 
components: {
  VueCropper,
},

main.js
import VueCropper from vue-cropper 

Vue.use(vueCropper)

cdn
<script src="vuecropper.js"></script>
Vue.use(window['vue-cropper'])
```


### V0.43

Peel off EXIF's dependency library, add exfi-min.js to reduce code size 45.9k = 37k

Build upgrade webpack4 upgrade

` ` ` ` ` ` ` ` ` '.

Add Vue install method = "npm: Vue.use (VueCropper) web: Vue.use (window['vue-cropper'])"

` ` ` ` ` ` ` ` ` '.




### V0.42

Repair screenshots because of the problem of removing decimal points.



### V0.41

Repair boundary problem of screenshots




### V0.40

The way to repair orientation

Thanks for the contribution of [Felipe Mengatto] (https://github.com/felipemengatto).

### v0.40
fix orientation handel
Thanks for the contribution of [Felipe Mengatto] (https://github.com/felipemengatto)


### v0.39

Fix problems caused by different orientation values
Thanks for the contribution of [Felipe Mengatto] (https://github.com/felipemengatto)


### v0.38
```
Modify coordinate feedback problem
```


### v0.37
```
Fix screenshot of centerBox out of 1px issue
Add screenshot Image move trigger event
```

### v0.36
```
Fix rotation automatically generates screenshot box error
Modify autocrop to dynamically generate screenshot boxes
```

### v0.35
```
Fix other images without compression issues
```

### v0.34
``` provides a solution for mobile crashes
Modify maxImgSize to 2000
```

### v0.33
``` provides a solution for mobile crashes
maxImgSize limits the maximum width and height of the image to 2000px by default.
```

### v0.32
```
Add screenshot box information display
infoTrue true to show the true output image width and height false show the width of the screenshot box
```

### v0.30
```
Added image coordinate function this.$refs.cropper.getImgAxis()
Added the capture box coordinate function this.$refs.cropper.getCropAxis()
Added compatibility with HD devices high
Added screenshot box to limit the function within the image centerbox
Added automatic generation of screenshot box function this.$refs.cropper.goAutoCrop
```

### v0.29
Added callback for image loading imgLoad returns result success, error
### v0.28
Fix the screenshot box fixed The screenshot box will affect the original image movement Zoom
### v0.27
Mouse scaling problem optimization
Img max-width style optimization
New attribute
CanMove can move pictures by default is yes
CanMoveBox move the screenshot box by default?
Original Whether to render in the original scale of the image Default is No


### v0.26
Fix Firefox browser mouse zoom problem

### v0.25
Fix image may not show

### v0.24
Fix ios photo rotation Screenshot problem Add auto fix image Screenshot preview code change, modify default upload image as blob preview
``` html
realTime (data) {
  this.previews = data
}
<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>
```


### v0.23
Small optimization
### v0.22
 New modified image size function called by this.$refs.cropper.changeScale

### v0.21
Added fixed screenshot frame size fiexdBox (Note: It is best to use the automatic generation of screenshot box)

### v0.20
Added output original image scale screenshot props name full, fix zoom image too large sensitivity problem

### v0.19
Add image rotation to fix mac wheel over-sensitive
``` js
this.$refs.cropper.rotateRight() // Rotate 90 degrees to the right
this.$refs.cropper.rotateLeft() // Rotate 90 degrees to the left
```

### v0.18
Fix default build screenshot box over container error
### v0.17
Fix blob data acquisition error
### v0.15
Add mobile phone gesture zoom
```
canScale: true
```

### v0.13
Add preview
``` html
@realTime="realTime"
// Real time preview function
realTime (data) {
  this.previews = data
}
<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="option.img" :style="previews.img">
  </div>
</div>
```
