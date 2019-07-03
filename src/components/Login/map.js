export default {
  UserName: {
    props: {
      size: "large",
      id: "userName",
      prefixType: "user",
      placeholder: "admin"
    },
    rules: [
      {
        required: true,
        message: "Please enter username!"
      }
    ]
  },
  Password: {
    props: {
      size: "large",
      prefixType: "lock",
      type: "password",
      id: "password",
      placeholder: "888888"
    },
    rules: [
      {
        required: true,
        message: "Please enter password!"
      }
    ]
  },
  Mobile: {
    props: {
      size: "large",
      prefixType: "mobile",
      placeholder: "mobile number"
    },
    rules: [
      {
        required: true,
        message: "Please enter mobile number!"
      },
      {
        pattern: /^1\d{10}$/,
        message: "Wrong mobile number format!"
      }
    ]
  },
  Captcha: {
    props: {
      size: "large",
      prefixType: "mail",
      placeholder: "captcha"
    },
    rules: [
      {
        required: true,
        message: "Please enter Captcha!"
      }
    ]
  }
};
