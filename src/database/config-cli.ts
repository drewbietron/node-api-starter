// The seqeulize-cli tool takes in a different shape of config options
// compared to the sequelize library.  The cli options are needed so that we
// can run migrations in production since the `sync` option in the library
// just doesnt cut it and is dangerous to use.

// If you want to run this with production credentials locally,
// you will need to create a `.env.production` file that has the production
// environment variables set.  That file is not checked into Git.
import Environment from "../environment";

new Environment(process.env.NODE_ENV).init();

module.exports = {
  [process.env.NODE_ENV]: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    ssl: ["production", "staging"].includes(process.env.NODE_ENV),
    dialectOptions: {
      ssl: ["production", "staging"].includes(process.env.NODE_ENV)
    }
  }
};

console.log(
  `CLI is using ${process.env.DATABASE_URL} in NODE_ENV=${process.env.NODE_ENV}`
);
