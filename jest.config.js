module.exports = {
  roots: ["tests"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverageFrom: ["./src/**/*.ts"],
  testEnvironment: "jsdom"
};