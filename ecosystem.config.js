module.exports = {
  apps: [
    {
      name: "node-api-starter",
      script: "./dist/index.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
