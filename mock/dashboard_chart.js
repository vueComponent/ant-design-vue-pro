function chart(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [100, 40, 78, 10, 30, 48];
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = chart;
