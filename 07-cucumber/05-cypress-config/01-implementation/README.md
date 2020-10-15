# 05 Cypress config

In this example we are going to use cucumber with cypress

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- As we did with jest, we need a third party library to integrate cucumber with cypress. In this case this library is [cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor):

```bash
npm install cypress-cucumber-preprocessor @types/cypress-cucumber-preprocessor --save-dev
```

- Configure it:

_./cypress/plugins/index.ts_

```javascript

```

_./cypress.json_

```diff
{
  "baseUrl": "http://localhost:8080/#",
+ "testFiles": "**/*.feature",
+ "nonGlobalStepDefinitions": true
}

```

> [Configuration](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#cypress-configuration)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
