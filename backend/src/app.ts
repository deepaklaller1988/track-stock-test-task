// app.ts
import express from "express";
import authRouter from "./router/authRouter";
import thresholdRouter from "./router/thresholdRouter";
import cors from "cors";

const app = express();
const port = 5000;
app.use(express.json({ limit: "2450mb" }));
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
  origin: function (origin: any, callback: any) {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/auth", authRouter);
app.use("/threshold", thresholdRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});