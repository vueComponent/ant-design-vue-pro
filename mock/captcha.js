function captcha(req) {
  let res = null;
  switch (req.method) {
    case "GET":
      res = "captcha-xxx";
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = captcha;
