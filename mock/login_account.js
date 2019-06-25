function loginAccount(req) {
  const { password, userName, type } = req.body;
  console.log(req.body);
  let res = null;
  if (password === "ant.design" && userName === "admin") {
    res = {
      status: "ok",
      type,
      currentAuthority: "admin"
    };
  } else if (password === "ant.design" && userName === "user") {
    res = {
      status: "ok",
      type,
      currentAuthority: "user"
    };
  } else {
    res = {
      status: "error",
      type,
      currentAuthority: "guest"
    };
  }

  return res;
}

module.exports = loginAccount;
