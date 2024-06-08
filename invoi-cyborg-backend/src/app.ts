import { Application } from "express";
import express, { Request, Response } from "express";
import cors from "cors";
import errorHandler from "./app/middleware/errorHandler";
import router from "./app/routers";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://invoi-cyborg-client.vercel.app",
    credentials: true,
  })
);

app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Blind Date with Book API!",
  });
});

app.use(errorHandler);

export default app;
