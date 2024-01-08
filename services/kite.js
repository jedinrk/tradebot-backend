const KiteConnect = require("kiteconnect").KiteConnect;
const ta = require("ta-lib");
const talib = require("talib");

const kc = new KiteConnect({
  api_key: process.env.API_KEY,
});

const getAccessToken = (request_token) => {
  return new Promise((resolve, reject) => {
    kc.generateSession(request_token, process.env.API_SECRET)
      .then(function (response) {
        kc.setAccessToken(response.access_token);
        resolve({
          status: "success",
          accessToken: response.access_token,
          userData: response,
        });
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

const calculateSMA200 = () => {
  // Fetch historical data using Zerodha's Kite API
  return new Promise((resolve, reject) => {
    kc.historical({
      instrument_token: "SBI",
      from: "2023-01-01",
      to: "2023-12-31",
      interval: "day",
    })
      .then((data) => {
        // Extract closing prices from the fetched data
        const closingPrices = data.map((item) => parseFloat(item.close));

        // Calculate SMA200 using ta-lib
        ta.execute(
          {
            name: "SMA",
            inReal: closingPrices,
            optInTimePeriod: 200,
          },
          (err, result) => {
            if (!err) {
              const sma200 = result.result.outReal.slice(-1)[0];
              console.log(`SMA200 for SBI: ${sma200}`);
              resolve(sma200);
            } else {
              console.error("Error calculating SMA200:", err);
              reject(err);
            }
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching historical data:", error);
        reject(error);
      });
  });
};

const calculateADX = (currentPrice) => {
  // Fetch historical data
  // Assuming 'high', 'low', 'close' arrays contain respective historical data

  const input = {
    high: high,
    low: low,
    close: close,
    startIdx: 0,
    endIdx: close.length - 1,
    optInTimePeriod: 14, // ADX period (standard is 14)
  };

  return new Promise((resolve, reject) => {
    talib.execute(
      {
        name: "ADX",
        startIdx: 0,
        endIdx: close.length - 1,
        inReal: input,
        optInTimePeriod: 14, // ADX period (standard is 14)
      },
      (err, result) => {
        if (!err) {
          const adxValues = result.result.outReal;
          console.log("Calculated ADX:", adxValues);
          resolve(adxValues);
        } else {
          console.error("Error calculating ADX:", err);
          reject(err);
        }
      }
    );
  });
};

function calculateProfitLoss(initialPrice, currentPrice, quantity, isBuy) {
  const brokerageFee = 0.02; // Example brokerage fee (2%)

  // Calculate total cost or revenue based on buy/sell
  const totalCost = initialPrice * quantity * (1 + brokerageFee);
  const totalRevenue = currentPrice * quantity * (1 - brokerageFee);

  // Calculate profit or loss
  let profitLoss = 0;
  if (isBuy) {
    profitLoss = totalRevenue - totalCost;
  } else {
    profitLoss = totalCost - totalRevenue;
  }

  return profitLoss;
}

module.exports = {
  getAccessToken,
  placeOrder,
  getPositions,
  calculateSMA200,
  calculateADX,
  calculateProfitLoss,
};
