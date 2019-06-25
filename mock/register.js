function register(req) {
  let res = null;
  switch (req.method) {
    case "POST":
      res = { status: "ok", currentAuthority: "user" };
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = register;
