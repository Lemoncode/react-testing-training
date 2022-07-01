import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:8080/#',
    specPattern: [
      '**/*.feature',
      'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
    ]
  },
});
