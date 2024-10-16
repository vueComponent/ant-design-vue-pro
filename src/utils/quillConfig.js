/*富文本编辑图片上传配置*/
const uploadConfig = {
  action: process.env.VUE_APP_API_UPLOAD_URL, // 必填参数 图片上传地址
  attachsPrefix: process.env.VUE_APP_API_VIEW_PIC_URL,
  methods: 'POST', // 必填参数 图片上传方式
  name: 'file', // 必填参数 文件的参数名
  token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  size: 1024, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/jpeg', // 可选 可上传的图片格式
  acceptVideo: 'video/*'
};

// toolbar工具栏的工具选项（默认展示全部）
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{
    'header': 1
  }, {
    'header': 2
  }], // custom button values
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'script': 'sub'
  }, {
    'script': 'super'
  }], // superscript/subscript
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }], // outdent/indent
  [{
    'direction': 'rtl'
  }], // text direction

  [{
    'size': ['small', false, 'large', 'huge']
  }], // custom dropdown
  [{
    'header': [1, 2, 3, 4, 5, 6, false]
  }],

  [{
    'color': []
  }, {
    'background': []
  }], // dropdown with defaults from theme
  [{
    'font': []
  }],
  [{
    'align': []
  }],
  ['clean'], // remove formatting button
  ['link', 'image', 'video']
]
const handlers = {
  image: function image() {
    var self = this;

    var fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput === null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept);
      fileInput.classList.add('ql-image');
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 创建formData
        var formData = new FormData();
        formData.append(uploadConfig.name, fileInput.files[0]);
        // 如果需要token且存在token
        if (uploadConfig.token) {
          formData.append('token', uploadConfig.token)
        }
        // 图片上传
        var xhr = new XMLHttpRequest();
        xhr.open(uploadConfig.methods, uploadConfig.action, true);
        // 上传数据成功，会触发
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            let length = self.quill.getSelection(true).index;
            //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。            
            self.quill.insertEmbed(length, 'image', uploadConfig.attachsPrefix + res.fileName);
            self.quill.setSelection(length + 1)
          }
          fileInput.value = ''
        };
        // 开始上传数据
        xhr.upload.onloadstart = function (e) {
          fileInput.value = ''
        };
        // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
        xhr.upload.onerror = function (e) {};
        // 上传数据完成（成功或者失败）时会触发
        xhr.upload.onloadend = function (e) {
          // console.log('上传结束')
        };
        xhr.send(formData)
      });
      debugger
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  },
  video: function video() {
    var self = this;

    var fileInput = this.container.querySelector('input.ql-video[type=file]');
    if (fileInput === null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.acceptVideo);
      fileInput.classList.add('ql-video');
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 创建formData
        var formData = new FormData();
        formData.append(uploadConfig.name, fileInput.files[0]);
        // 如果需要token且存在token
        if (uploadConfig.token) {
          formData.append('token', uploadConfig.token)
        }
        // 视频上传
        var xhr = new XMLHttpRequest();
        xhr.open(uploadConfig.methods, uploadConfig.action, true);
        // 上传数据成功，会触发
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            let length = self.quill.getSelection(true).index;
            //这里很重要，你视频上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。            
            self.quill.insertEmbed(length, 'video', uploadConfig.attachsPrefix + res.fileName);
            self.quill.setSelection(length + 1)
          }
          fileInput.value = ''
        };
        // 开始上传数据
        xhr.upload.onloadstart = function (e) {
          fileInput.value = ''
        };
        // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
        xhr.upload.onerror = function (e) {};
        // 上传数据完成（成功或者失败）时会触发
        xhr.upload.onloadend = function (e) {
          // console.log('上传结束')
        };
        xhr.send(formData)
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }
};

export default {
  placeholder: '请输入内容',
  modules: {
    toolbar: {
      container: toolbarOptions, // 工具栏选项
      handlers: handlers // 事件重写
    }
  }
};