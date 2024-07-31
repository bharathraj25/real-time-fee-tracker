// will cahce extra 20 mins of data for future use
const nextMinsCaching = 20;

const getPriceFromBinanceSpot = async (symbol, timestamp, interval = "1s") => {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol,
        interval,
        startTime: timestamp,
        limit: nextMinsCaching * 60,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching price from Binance: ${error.message}`);
  }
};

module.exports = { getPriceFromBinanceSpot };
