const express = require("express");
const cors = require("cors");
const app = express();
const port = 8545;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Mount routers for smartcontracts
app.use(
  "/api/smartcontracts/neurodataprov",
  require("./api/smartcontracts/neuroDataProvenance"),
);
app.use(
  "/api/smartcontracts/neurograntdao",
  require("./api/smartcontracts/neuroGrantDAO"),
);
app.use(
  "/api/smartcontracts/neurotoken",
  require("./api/smartcontracts/neuroToken"),
);
app.use(
  "/api/smartcontracts/researchcollab",
  require("./api/smartcontracts/researchCollaboration"),
);
app.use(
  "/api/smartcontracts/researchfunding",
  require("./api/smartcontracts/researchFunding"),
);
app.use(
  "/api/smartcontracts/sciencetoken",
  require("./api/smartcontracts/scienceToken"),
);

// Mount the datasets router
app.use("/api/datasets", require("./api/datasets/datasets"));

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
