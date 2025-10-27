<template>
	 <view class="container loading5">
		<view class="shape shape1"></view>
		<view class="shape shape2"></view>
		<view class="shape shape3"></view>
		<view class="shape shape4"></view>
	</view>
</template>

<script>
	export default {
		name: 'loading5',
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

.container.loading5 .shape {
  width: 15px;
  height: 15px;
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

.loading5 .shape1 {
  animation: animation5shape1 2s ease 0s infinite reverse;
}

@-webkit-keyframes animation5shape1 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, 15px);
            transform: translate(0, 15px);
  }
  50% {
    -webkit-transform: translate(15px, 15px);
            transform: translate(15px, 15px);
  }
  75% {
    -webkit-transform: translate(15px, 0);
            transform: translate(15px, 0);
  }
}

@keyframes animation5shape1 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, 15px);
            transform: translate(0, 15px);
  }
  50% {
    -webkit-transform: translate(15px, 15px);
            transform: translate(15px, 15px);
  }
  75% {
    -webkit-transform: translate(15px, 0);
            transform: translate(15px, 0);
  }
}
.loading5 .shape2 {
  animation: animation5shape2 2s ease 0s infinite reverse;
}

@-webkit-keyframes animation5shape2 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(-15px, 0);
            transform: translate(-15px, 0);
  }
  50% {
    -webkit-transform: translate(-15px, 15px);
            transform: translate(-15px, 15px);
  }
  75% {
    -webkit-transform: translate(0, 15px);
            transform: translate(0, 15px);
  }
}

@keyframes animation5shape2 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(-15px, 0);
            transform: translate(-15px, 0);
  }
  50% {
    -webkit-transform: translate(-15px, 15px);
            transform: translate(-15px, 15px);
  }
  75% {
    -webkit-transform: translate(0, 15px);
            transform: translate(0, 15px);
  }
}
.loading5 .shape3 {
  animation: animation5shape3 2s ease 0s infinite reverse;
}

@-webkit-keyframes animation5shape3 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(15px, 0);
            transform: translate(15px, 0);
  }
  50% {
    -webkit-transform: translate(15px, -15px);
            transform: translate(15px, -15px);
  }
  75% {
    -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
  }
}

@keyframes animation5shape3 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(15px, 0);
            transform: translate(15px, 0);
  }
  50% {
    -webkit-transform: translate(15px, -15px);
            transform: translate(15px, -15px);
  }
  75% {
    -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
  }
}
.loading5 .shape4 {
  animation: animation5shape4 2s ease 0s infinite reverse;
}

@-webkit-keyframes animation5shape4 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
  }
  50% {
    -webkit-transform: translate(-15px, -15px);
            transform: translate(-15px, -15px);
  }
  75% {
    -webkit-transform: translate(-15px, 0);
            transform: translate(-15px, 0);
  }
}

@keyframes animation5shape4 {
  0% {
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
  }
  25% {
    -webkit-transform: translate(0, -15px);
            transform: translate(0, -15px);
  }
  50% {
    -webkit-transform: translate(-15px, -15px);
            transform: translate(-15px, -15px);
  }
  75% {
    -webkit-transform: translate(-15px, 0);
            transform: translate(-15px, 0);
  }
}

</style>
