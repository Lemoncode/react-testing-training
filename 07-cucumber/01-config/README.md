# 01 Config

In this example we are going to configure cucumber with jest.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- [Cucumber](https://cucumber.io) is a great tool for create living documentation within BDD (Behaviour Driven Development). That is, using a natural language description, we connect to automated tests to produce this documentation. It uses [Gherkin syntax](https://cucumber.io/docs/gherkin/reference/) to give structure and meaning to executable specifications.

- Let's install [jest-cucumber](https://github.com/bencompton/jest-cucumber) to use cucumber inside jest:

```bash
npm install jest-cucumber --save-dev
```

> [Gherkin VS Code extension](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

- Add an example to give some specs:

_./src/rocket.ts_

```javascript
export class Rocket {
  public isInSpace: boolean = false;
  public boostersLanded: boolean = true;

  public launch() {
    this.isInSpace = true;
    this.boostersLanded = true;
  }
}

```

- Add Rocket `feature` to define different scenarios:

_./src/rocket.feature_

```gherkin
Feature: Rocket Launching

Scenario: Launching a SpaceX rocket
  Given I am Elon Musk attempting to launch a rocket into space
  When I launch the rocket
  Then The rocket should end up in space
  And The boosters should land back on the launch pad again

```

> `Give`: Used to describe the initial context
> `When`: An event or action
> `Then`: Expected result
> `And`: And, But -> instead of write consecutives Given's, When's or Then's

- Usually, `Cucumber` names `steps` to the file that it will execute all Gherkin definition:

_./src/rocket.steps.ts_

```javascript
import { loadFeature } from 'jest-cucumber';

const feature = loadFeature('./src/rocket.feature');
```

- Define test structure:

_./src/rocket.steps.ts_

```diff
- import { loadFeature } from 'jest-cucumber';
+ import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('./src/rocket.feature');

+ defineFeature(feature, (scenario) => {
+   scenario('Launching a SpaceX rocket', ({ given, when, then, and }) => {
+ 
+   });
+ });

```

- Let's add the test:

_./src/rocket.steps.ts_

```diff
import { loadFeature, defineFeature } from 'jest-cucumber';
+ import { Rocket } from './rocket';

const feature = loadFeature('./src/rocket.feature');

defineFeature(feature, (scenario) => {
  scenario('Launching a SpaceX rocket', ({ given, when, then, and }) => {
+   let rocket: Rocket;

+   given('I am Elon Musk attempting to launch a rocket into space', () => {
+     rocket = new Rocket();
+   });

+   when('I launch the rocket', () => {
+     rocket.launch();
+   });

+   then('The rocket should end up in space', () => {
+     expect(rocket.isInSpace).toBeTruthy();
+   });

+   and('The boosters should land back on the launch pad again', () => {
+     expect(rocket.boostersLanded).toBeTruthy();
+   });
  });
});

```

- We need to update `jest` config:

_./config/test/jest.js_

```diff
module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
+ testMatch: [
+   '**/__tests__/**/*.[jt]s?(x)',
+   '**/?(*.)+(spec|test|steps).[jt]s?(x)',
+ ],
};

```

> [testMatch](https://jestjs.io/docs/en/configuration#testmatch-arraystring)


# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
