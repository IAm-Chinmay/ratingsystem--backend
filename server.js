const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));
app.use("/user", require("./routes/user"));
app.use("/store-owner", require("./routes/storeOwner"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to sync DB", err);
  }
});
