# 02 Base

In this example we are going to learn some Gherkin concepts.

We will start from `01-config`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's add the `calculator` implementation:

_./src/calculator.ts_

```javascript
export const add = (a, b) => a + b;

export const divide = (a, b) => (b !== 0 ? a / b : undefined);

```

- Let's add the Gherkin first:

_./src/calculator.feature_

```gherkin
Feature: Calculator operations

    Scenario: Add the numbers 2 and 2 should return 4
      Given I have entered 2 as the first operand
      And I have entered 2 as the second operand
      When I add both numbers
      Then The result should be 4

```

- Let's add the tests:

_./src/calculator.steps.ts_

```javascript
import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('./src/calculator.feature');

defineFeature(feature, (scenario) => {
  scenario('Add the numbers 2 and 2 should return 4', ({ given, and, when, then }) => {

  });
});

```

- Implement scenario:

_./src/calculator.steps.ts_

```diff
import { loadFeature, defineFeature } from 'jest-cucumber';
+ import { add } from './calculator';

const feature = loadFeature('./src/calculator.feature');

defineFeature(feature, (scenario) => {
+   let firstOperand, secondOperand, result;

  scenario('Add the numbers 2 and 2 should return 4', ({ given, and, when, then }) => {

+   given('I have entered 2 as the first operand', () => {
+     firstOperand = 2;
+   });
+   and('I have entered 2 as the second operand', () => {
+     secondOperand = 2;
+   });
+   when('I add both numbers', () => {
+     result = add(firstOperand, secondOperand);
+   });
+   then('The result should be 4', () => {
+     expect(result).toEqual(4);
+   });
  });
});
```

- Let's add the scenario with negative numbers:

_./src/calculator.feature_

```diff
Feature: Calculator operations

    Scenario: Add the numbers 2 and 2 should return 4
      Given I have entered 2 as the first operand
      And I have entered 2 as the second operand
      When I add both numbers
      Then The result should be 4

+   Scenario: Add the numbers 2 and -6 should return -4
+     Given I have entered 2 as the first operand
+     And I have entered -6 as the second operand
+     When I add both numbers
+     Then The result should be -4

```

- Let's implement it:

_./src/calculator.steps.ts_

```diff
...

+ scenario('Add the numbers 2 and -6 should return -4', ({ given, and, when, then }) => {
+   given('I have entered 2 as the first operand', () => {
+     firstOperand = 2;
+   });
+   and('I have entered -6 as the second operand', () => {
+     secondOperand = -6;
+   });
+   when('I add both numbers', () => {
+     result = add(firstOperand, secondOperand);
+   });
+   then('The result should be -4', () => {
+     expect(result).toEqual(-4);
+   });
+ });
...

```

- It could be tedious if we want to add several use cases, let's refactor it:

_./src/calculator.feature_

```diff
Feature: Calculator operations

- Scenario: Add the numbers 2 and 2 should return 4
+ Scenario Outline: Add the numbers <firstOperand> and <secondOperand> should return <result>
-   Given I have entered 2 as the first operand
+   Given I have entered <firstOperand> as the first operand
-   And I have entered 2 as the second operand
+   And I have entered <secondOperand> as the second operand
    When I add both numbers
-   Then The result should be 4
+   Then The result should be <result>

- Scenario: Add the numbers 2 and -6 should return -4
-   Given I have entered 2 as the first operand
-   And I have entered -6 as the second operand
-   When I add both numbers
-   Then The result should be -4

+   Examples:
+     | firstOperand | secondOperand | result |
+     | 2            | 2             | 4      |
+     | 2            | -6            | -4     |
+     | 6            | -2            | 4      |
+     | 4            | -4            | 0      |
+     | -4           | -4            | -8     |

```

- Refactor steps:

_./src/calculator.steps.ts_

```diff
import { loadFeature, defineFeature } from 'jest-cucumber';
import { add } from './calculator';

const feature = loadFeature('./src/calculator.feature');

defineFeature(feature, (scenario) => {
  let firstOperand, secondOperand, result;

- scenario('Add the numbers 2 and 2 should return 4', ({ given, and, when, then }) => {
+ scenario(
+   'Add the numbers <firstOperand> and <secondOperand> should return <result>',
+   ({ given, and, when, then }) => {
-   given('I have entered 2 as the first operand', () => {
-     firstOperand = 2;
+   given(/^I have entered (.*) as the first operand$/, (first: string) => {
+     firstOperand = Number(first);
    });
-   and('I have entered 2 as the second operand', () => {
-     secondOperand = 2;
+   and(/^I have entered (.*) as the second operand$/, (second: string) => {
+     secondOperand = Number(second);
    });
    when('I add both numbers', () => {
      result = add(firstOperand, secondOperand);
    });
-   then('The result should be 4', () => {
-     expect(result).toEqual(4);
+   then(/^The result should be (.*)$/, (expectedResult: string) => {
+     expect(result).toEqual(Number(expectedResult));
    });
  });

- scenario('Add the numbers 2 and -6 should return -4', ({ given, and, when, then }) => {
-   given('I have entered 2 as the first operand', () => {
-     firstOperand = 2;
-   });
-   and('I have entered -6 as the second operand', () => {
-     secondOperand = -6;
-   });
-   when('I add both numbers', () => {
-     result = add(firstOperand, secondOperand);
-   });
-   then('The result should be -4', () => {
-     expect(result).toEqual(-4);
-   });
- });
});

```

- Let's add the division scenario:

_./src/calculator.feature_

```diff
Feature: Calculator operations

  Scenario Outline: Add the numbers <firstOperand> and <secondOperand> should return <result>
    Given I have entered <firstOperand> as the first operand
    And I have entered <secondOperand> as the second operand
    When I add both numbers
    Then The result should be <result>

    Examples:
      | firstOperand | secondOperand | result |
      | 2            | 2             | 4      |
      | 2            | -6            | -4     |
      | 6            | -2            | 4      |
      | 4            | -4            | 0      |
      | -4           | -4            | -8     |

+ Scenario Outline: Divide the numbers <firstOperand> and <secondOperand> should return <result>
+   Given I have entered <firstOperand> as the first operand
+   And I have entered <secondOperand> as the second operand
+   When I divide both numbers
+   Then The result should be <result>

+   Examples: Successful division
+     | firstOperand | secondOperand | result |
+     | 4            | 2             | 2      |
+     | 2            | 4             | 0.5    |
+     | 4            | -2            | -2     |
+     | 2            | -4            | -0.5   |
+     | 0            | 2             | 0      |

+   Examples: Unsuccessful division
+     | firstOperand | secondOperand | result    |
+     | 2            | 0             | undefined |

```

- Implement division tests:

_./src/calculator.steps.ts_

```diff
import { loadFeature, defineFeature } from 'jest-cucumber';
- import { add } from './calculator';
+ import { add, divide } from './calculator';
...

+ scenario(
+   'Divide the numbers <firstOperand> and <secondOperand> should return <result>',
+   ({ given, and, when, then }) => {
+     given(/^I have entered (.*) as the first operand$/, (first: string) => {
+       firstOperand = Number(first);
+     });
+     and(/^I have entered (.*) as the second operand$/, (second: string) => {
+       secondOperand = Number(second);
+     });
+     when('I divide both numbers', () => {
+       result = divide(firstOperand, secondOperand);
+     });
+     then(/^The result should be (.*)$/, (expectedResult: string) => {
+       if (expectedResult === 'undefined') {
+         expect(result).toEqual(undefined);
+       } else {
+         expect(result).toEqual(Number(expectedResult));
+       }
+     });
+   }
+ );
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
