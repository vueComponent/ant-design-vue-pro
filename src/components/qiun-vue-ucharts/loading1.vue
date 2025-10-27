<template>
	 <view class="container loading1">
		<view class="shape shape1"></view>
		<view class="shape shape2"></view>
		<view class="shape shape3"></view>
		<view class="shape shape4"></view>
	</view>
</template>

<script>
	export default {
		name: 'loading1',
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped="true">
.container {
  width: 30px;
  height: 30px;
  position: relative;
}
.container.loading1 {
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
}

.container .shape {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 1px;
}
.container .shape.shape1 {
  left: 0;
  background-color: #1890FF;
}
.container .shape.shape2 {
  right: 0;
  background-color: #91CB74;
}
.container .shape.shape3 {
  bottom: 0;
  background-color: #FAC858;
}
.container .shape.shape4 {
  bottom: 0;
  right: 0;
  background-color: #EE6666;
}

.loading1 .shape1 {
  -webkit-animation: animation1shape1 0.5s ease 0s infinite alternate;
          animation: animation1shape1 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape1 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, 16px);
            transform: translate(16px, 16px);
  }
}

@keyframes animation1shape1 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, 16px);
            transform: translate(16px, 16px);
  }
}
.loading1 .shape2 {
  -webkit-animation: animation1shape2 0.5s ease 0s infinite alternate;
          animation: animation1shape2 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape2 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, 16px);
            transform: translate(-16px, 16px);
  }
}

@keyframes animation1shape2 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, 16px);
            transform: translate(-16px, 16px);
  }
}
.loading1 .shape3 {
  -webkit-animation: animation1shape3 0.5s ease 0s infinite alternate;
          animation: animation1shape3 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape3 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, -16px);
            transform: translate(16px, -16px);
  }
}

@keyframes animation1shape3 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(16px, -16px);
            transform: translate(16px, -16px);
  }
}
.loading1 .shape4 {
  -webkit-animation: animation1shape4 0.5s ease 0s infinite alternate;
          animation: animation1shape4 0.5s ease 0s infinite alternate;
}

@-webkit-keyframes animation1shape4 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, -16px);
            transform: translate(-16px, -16px);
  }
}

@keyframes animation1shape4 {
  from {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  to {
    -webkit-transform: translate(-16px, -16px);
            transform: translate(-16px, -16px);
  }
}


</style>
