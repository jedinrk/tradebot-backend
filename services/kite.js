const KiteConnect = require("kiteconnect").KiteConnect;

const kc = new KiteConnect({
  api_key: process.env.API_KEY,
});

const getAccessToken = (request_token) => {
  return new Promise((resolve, reject) => {
    kc.generateSession(request_token, process.env.API_SECRET)
      .then(function (response) {
        console.log(response);
        kc.setAccessToken(response.access_token);
        resolve({ status: "success", accessToken: response.access_token });
      })
      .catch(function (err) {
        console.log(err);
        reject({ status: "error" });
      });
  });
};

const getPositions = async () => {
  return await kc.getPositions();
};

const placeOrder = (variety, params) => {
  kc.placeOrder();
};

module.exports = {
  getAccessToken,
  placeOrder,
  getPositions
};
