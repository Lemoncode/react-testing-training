# 05 Cypress config

In this example we are going to use cucumber with cypress

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- As we did with jest, we need a third party library to integrate cucumber with cypress. In this case this library is [cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor):

```bash
npm install @badeball/cypress-cucumber-preprocessor @cypress/webpack-preprocessor
```

- Configure it (here an [official example](https://github.com/badeball/cypress-cucumber-preprocessor/tree/master/examples/webpack)):

_./cypress.config.ts_

```diff
import { defineConfig } from 'cypress';
+ import webpack from '@cypress/webpack-preprocessor';
+ import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

+ export async function setupNodeEvents(
+   on: Cypress.PluginEvents,
+   config: Cypress.PluginConfigOptions
+ ): Promise<Cypress.PluginConfigOptions> {
+   await addCucumberPreprocessorPlugin(on, config);

+   on(
+     'file:preprocessor',
+     webpack({
+       webpackOptions: {
+         resolve: {
+           extensions: ['.ts', '.js'],
+         },
+         module: {
+           rules: [
+             {
+               test: /\.ts$/,
+               exclude: /node_modules/,
+               loader: 'babel-loader',
+             },
+             {
+               test: /\.feature$/,
+               use: [
+                 {
+                   loader: '@badeball/cypress-cucumber-preprocessor/webpack',
+                   options: config,
+                 },
+               ],
+             },
+           ],
+         },
+       },
+     })
+   );
+   return config;
+ }

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080/#',
+   specPattern: '**/*.feature',
+   setupNodeEvents,
  },
});

```

- Let's add the first feature:

_./cypress/e2e/login.feature_

```gherkin
Feature: Login Page

  Scenario: Visit login page and type invalid credentials
    Given I visit the login page
    When I type valid user name
    But I type invalid password
    And I press login button
    Then I should see an alert with a message

```

_./cypress/e2e/login.ts_

```javascript
import {
  Given,
  When,
  But,
  And,
  Then,
} from '@badeball/cypress-cucumber-preprocessor';

let user, password;

Given('I visit the login page', () => {
  cy.on('window:alert', cy.stub().as('alertStub'));
  cy.visit('/');
});

When('I type valid user name', () => {
  user = 'admin';
  cy.findByLabelText('Name').as('userInput');
  cy.get('@userInput').type(user);
});

But('I type invalid password', () => {
  password = '1234';
  cy.findByLabelText('Password').as('passwordInput');
  cy.get('@passwordInput').type(password);
});

And('I press login button', () => {
  cy.findByRole('button', { name: 'Login' }).click();
});

Then('I should see an alert with a message', () => {
  cy.get('@userInput').should('have.value', user);
  cy.get('@passwordInput').should('have.value', password);
  cy.get('@alertStub').should(
    'have.been.calledWith',
    'invalid credentials, use admin/test, excercise: display a mui snackbar instead of this alert.'
  );
});

```

> Important the file name should be the same as feature.

- Running it:

```bash
npm run test:e2e
```

- Let's add a second scenario:

_./cypress/e2e/login.feature_

```diff
...

+ Scenario: Visit login page and type valid credentials
+   Given I visit the login page
+   When I type valid user name
+   And I type valid password
+   And I press login button
+   Then I should navigate to hotels page
```

- Implement steps:

_./cypress/e2e/login.ts_

```diff
...

+ And('I type valid password', () => {
+   password = 'test';
+   cy.findByLabelText('Password').as('passwordInput');
+   cy.get('@passwordInput').type(password);
+ });

+ Then('I should navigate to hotels page', () => {
+   cy.url().should('eq', 'http://localhost:8080/#/hotel-collection');
+ });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
