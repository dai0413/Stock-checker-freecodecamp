const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const checkStockData = (stockData, stockName, rel_likes = false) => {
  assert.isObject(stockData, "stockdata should be an object");
  assert.equal(stockData.stock, stockName);
  assert.property(stockData, "price", "stockdata should have a price");

  if (!rel_likes) {
    assert.property(stockData, "likes", "stockdata should have a likes");
    assert.isNumber(stockData.likes, "likes should be a number");
  } else {
    assert.property(
      stockData,
      "rel_likes",
      "stockdata should have a rel_likes"
    );
    assert.isNumber(stockData.rel_likes, "rel_likes should be a number");
  }
};

suite("Functional Tests", function () {
  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(`/api/stock-prices/`)
      .query({ stock: "TSLA" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "res body should be an object");
        assert.property(
          res.body,
          "stockData",
          "res body should have stockdata property"
        );

        const stockData = res.body.stockData;
        checkStockData(stockData, "TSLA");

        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(`/api/stock-prices/`)
      .query({ stock: "GOLD", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "res body should be an object");
        assert.property(
          res.body,
          "stockData",
          "res body should have stockdata property"
        );

        const stockData = res.body.stockData;
        checkStockData(stockData, "GOLD");
        assert.equal(stockData.likes, 1);

        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(`/api/stock-prices/`)
      .query({ stock: "GOLD", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "res body should be an object");
        assert.property(
          res.body,
          "stockData",
          "res body should have stockdata property"
        );

        const stockData = res.body.stockData;
        checkStockData(stockData, "GOLD");
        assert.equal(stockData.likes, 1);

        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(`/api/stock-prices/`)
      .query({ stock: ["TSLA", "GOOG"] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "res body should be an object");
        assert.property(
          res.body,
          "stockData",
          "res body should have stockdata property"
        );

        const stockData = res.body.stockData;
        console.log("STOCKDATA", stockData);
        assert.isArray(stockData, "stockdata should be array");
        assert.lengthOf(
          stockData,
          2,
          "stockData should have exactly 2 elements"
        );

        checkStockData(stockData[0], "TSLA", true);
        checkStockData(stockData[1], "GOOG", true);

        assert.equal(stockData[0].rel_likes + stockData[1].rel_likes, 0);

        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(`/api/stock-prices/`)
      .query({ stock: ["TSLA", "GOOG"], like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "res body should be an object");
        assert.property(
          res.body,
          "stockData",
          "res body should have stockdata property"
        );

        const stockData = res.body.stockData;
        console.log("STOCKDATA", stockData);
        assert.isArray(stockData, "stockdata should be array");
        assert.lengthOf(
          stockData,
          2,
          "stockData should have exactly 2 elements"
        );

        checkStockData(stockData[0], "TSLA", true);
        checkStockData(stockData[1], "GOOG", true);

        assert.equal(stockData[0].rel_likes + stockData[1].rel_likes, 0);

        done();
      });
  });
});
