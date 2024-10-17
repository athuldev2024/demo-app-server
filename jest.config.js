module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/controllers/*.js", "src/constants/*.js"],
  coveragePathIgnorePatterns: [
    "/node_modules/", // Exclude node_modules
    "/test/", // Exclude the test folder
  ],
  coverageReporters: [
    "text", // Show text output in the terminal
  ],
};
