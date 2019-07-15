const city = require("./geographic/city.json");
const province = require("./geographic/province.json");

function getProvince(req, res) {
  return res.json(province);
}

function getCity(req, res) {
  return res.json(city[req.params.province]);
}

module.exports = {
  "GET /api/geographic/province": getProvince,
  "GET /api/geographic/city/:province": getCity
};
