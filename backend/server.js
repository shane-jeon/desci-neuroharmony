const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = 8545;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Proxy middleware for Python server
app.use(
  "/api/python",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
  }),
);

// Mount the datasets router
app.use("/api/datasets", require("./services/api/datasets/datasets"));

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
