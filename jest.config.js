require("custom-env").env(process.env.NODE_ENV);

module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  // setupFiles: ['./test/mocks/sendgrid.ts'],
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testPathIgnorePatterns: ["node_modules", "dist"],
  testMatch: ["**/**/*.test.(ts|js)"],
  testEnvironment: "node",
  preset: "ts-jest"
};
