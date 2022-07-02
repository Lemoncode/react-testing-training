# 99 Cucumber

## References

[Cypress migration guide](https://testersdock.com/cypress-10-upgrade/)

### Installing Packages

```bash
npm install -D @badeball/cypress-cucumber-preprocessor
npm install -D @bahmutov/cypress-esbuild-preprocessor
npm install -D @esbuild-plugins/node-modules-polyfill
```

- Now we have to create the the configuration for `Cucumber plugins`

### ./cypress/plugins/index.js

```js
const createEsbuildPlugin =
  require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const nodePolyfills =
  require('@esbuild-plugins/node-modules-polyfill').NodeModulesPolyfillPlugin;
const addCucumberPreprocessorPlugin =
  require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;

module.exports = async (on, config) => {
  await addCucumberPreprocessorPlugin(on, config); // to allow json to be produced
  // To use esBuild for the bundler when preprocessing
  on(
    'file:preprocessor',
    createBundler({
      plugins: [nodePolyfills(), createEsbuildPlugin(config)],
    })
  );
  return config;
};
```

- We need to update `Cypress` configuration in order to have `Cucumber` tests loaded. Update `./cypress.config.ts`

### ./cypress.config.ts

```ts
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
```

- Update `package.json` with a new entry

```json
{
  // ....
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/cucumber-test/**/*.{js,ts}"
  }
  // ....
}
```

This is done because most of the configuration options have been removed as a result of architectural changes and now there’s no distinction between “global” and “non-global” steps anymore. Steps are searched for using patterns and you can choose to include global steps or not.


- Lets add a new test using `Cucumber`. Create `./e2e/cucumber-test/login.feature`

### ./e2e/cucumber-test/login.feature

```feature
Feature: Login

    Scenario Outline: Login to Orange CRM Website

        Given User is at the login page
        When User enters username as '<username>' and password as '<password>'
        And User clicks on login button
        Then User is able to successfully login to the Website
        Examples:
            | username | password |
            | admin    | 1234     |
```

- Create `./e2e/cucumber-test/login/login.js`

```js
import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor"

Given('User is at the login page', () => {
    cy.visit('/')
});

When('User enters username as {string} and password as {string}', (username, password) => {
    cy.get('input[name="name"]').type(username);
    cy.get('input[name="password"]').type(password);
});

And('User clicks on login button', () => {
    cy.get('button').click();
});

Then('User is able to successfully login to the Website', () => {
    cy.get('#welcome').should('be.visible', {timeout: 10000})
});
```

- If we run the tests by using `npm run test:e2e` we will get an error related with target transformations, we can solve it by updating `./cypress/tsconfig.json`

### ./cypress/tsconfig.json

```diff
{
  "compilerOptions": {
-   "target": "es5",
+   "target": "es6",
-   "lib": ["es5", "dom"],
+   "lib": ["es6", "dom"],
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts"]
}

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
