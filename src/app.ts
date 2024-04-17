import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import figlet from "figlet";
import morganMiddleware from "./middleware/morgan.middleware";

// Importing custom route middleware
import userRouter from "./user/routes/user.routes";
import adminRouter from "./admin/routes/admin.routes";

// Initializing express middleware
const app: Express = express();

// Middleware for cors and body-parse
app.use(cors({ origin: "*", methods: "GET, POST, PUT, DELETE" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Middleware routes
app.use("/api/v1", userRouter);
app.use("/api/v1/admin", adminRouter);

// base get route
app.get("/", (req, res) => {
  figlet.text(
    "Hotspot Meet server",
    {
      font: "Ghost",
    },
    function (err: any, data: any) {
      if (err) {
        console.log("Something went wrong...");
      }
      res.send(`<pre>${data}</pre>`);
    }
  );
});

export default app;
