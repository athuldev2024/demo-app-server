module.exports = [
  {
    // Define language options and global variables
    languageOptions: {
      ecmaVersion: 2021, // Use ECMAScript 2021 syntax
      globals: {
        // Import Node.js and ECMAScript 6 globals directly
        console: "readonly",
        process: "readonly",
        global: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        module: "readonly",
      },
    },
    // Use recommended ESLint and Prettier configurations
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error", // Treat Prettier issues as ESLint errors
      "no-unused-vars": "warn", // Warn for unused variables
      semi: ["error", "always"], // Enforce semicolons
      quotes: ["error", "double"], // Use double quotes
      "arrow-parens": ["error", "always"], // Always include parentheses in arrow functions
      eqeqeq: ["error", "always"], // Enforce strict equality (===)
      "no-console": "off", // Allow the use of console logs in development
    },
    // Ignore these directories and files from linting
    ignores: ["node_modules/**", "dist/**", "bin/**"],
  },
];
