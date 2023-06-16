const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://pixel.bet',
    defaultCommandTimeout: 6000,
    supportFile: false,
  },
});
