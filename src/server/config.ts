import express from "express";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import errorHandler from "errorhandler";
import { createContext, EXPECTED_OPTIONS_KEY } from "dataloader-sequelize";
import { resolver } from "graphql-sequelize";

// Routes
import index from "./routes/index";
import health from "./routes/health";
import session from "./routes/session";

// Graphql Schema
import schema from "../graphql/schema";

// Middlewares
import Authentication from "./middleware/authentication";
import Session from "../lib/session";
import database from "../database/database";

// Set up environment variables
import Environment from "../environment";

new Environment(process.env.NODE_ENV).init();

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

/*
 * GraphQL
 */
const graphql = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  context: async ({ req }) => {
    // https://github.com/mickhansen/graphql-sequelize/issues/656
    const dataloader = createContext(database);
    resolver.contextToOptions = {
      ...resolver.contextToOptions,
      dataloader: [EXPECTED_OPTIONS_KEY],
    };

    return {
      headers: req.headers,
      dataloader,
    };
  },
  engine: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
});
graphql.applyMiddleware({ app, path: "/__gql__" });
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

app.post("/session/login", session.login);
app.post("/session/signup", session.signUp);
app.post("/session/password-reset", session.passwordReset);
app.get("/session/validate", session.validateSession);

export default app;
