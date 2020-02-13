import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import errorHandler from "errorhandler";

// Routes
import index from "./routes/index";
import health from "./routes/health";

// Middlwares
import Authentication from "./middleware/authentication";
// import Session from './lib/session';

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

/*
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());
// Set up authenicated requests.  Routes that need to be authenicated
// can be added within middlewares/authentication
app.all("*", (req, res, next) =>
  new Authentication({ req, res, next }).authenticate()
);

/*
 * Primary app routes.
 */

app.get("/", index);
app.get("/_health", health);

export default app;
