# 01 Code Coverage

In this sample we are going to add test coverage to our project.

We will start from `01-github-actions`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- To get an up and working code coverage a simple script can be added to package.json to tell jest we need collect coverage report from our tests. That is, applying the `--coverage` flag:

_./package.json_

```diff
  "scripts": {
    ...
    "test": "jest -c ./config/test/jest.js --verbose",
    "test:watch": "npm run test -- --watchAll -i"
+   "pretest:coverage": "rimraf coverage",
+   "test:coverage": "npm run test -- --coverage"
  },
```

Note: Coverage reporting is an intensive task so we shouldn't execute it in _watch mode_. It's something we should do once we think we're done with our unit tests.

Let's see how this new command is working. Execute:

```bash
npm run test:coverage
```

> NOTE: [Jest default coverage reporters](https://jestjs.io/docs/en/configuration#coveragereporters-arraystring)

You'll note two things. First of all, we get a nice formatted table with a coverage summary from all executed tests and tested components.

Described columns are:

- **Statement coverage** - How many statements (or evaluated expressions) has been executed. 
- **Branch coverage** - How many posible paths has been called
- **Function coverage** - How many functions or subrutines in the program have been called
- **Line coverage** How many executable lines has been called

> Example:
> const x = 10; console.log(x)  -> 2 statements but 1 line.

Second thing you'll note is that a `coverage` folder is added with some extra files. By default jest uses four coverage tools `["json", "lcov", "text", "clover"]`, to report coverage results. The first one is the formatted table you saw on the console, `json` coverage result is located at `coverage/coverage-final.json` and `lcov` reports are inside `coverage/lcov-report` folder as a nice HTML document. Some extra info is added to the code:

- `'E'` stands for 'else path not taken', which means that for the marked if/else statement, the 'if' path has been tested but not the 'else'.
- `'I'` stands for 'if path not taken', which is the opposite case: the 'if' hasn't been tested.
- The `xN` in left column is the amount of times that line has been executed.
- Not executed lines, or pieces of code, will be highlighted in red.

And some colors:

- **Pink**: statements not covered.
- **Orange**: functions not covered.
- **Yellow**: branches not covered.

We'll add some extra configuration to our coverage reports. In order to do that first we'll create another jest configuration file called `jest.coverage.json` with the exact content as the previous configuration it was using. We'll add an extra line to tell jest we want to include coverage report using this new config:

_./config/test/jest.coverage.js_

```javascript
const base = require('./jest');

module.exports = {
  ...base,
  collectCoverage: true,
};

```

Let's update coverage command inside `package.json` to point this new config and remove the `--coverage` flag:

_./package.json_

```diff
  "test": "jest -c ./config/test/jest.json --verbose",
  "test:watch": "jest -c ./config/test/jest.json --verbose --watchAll -i",
  "pretest:coverage": "rimraf coverage",
- "test:coverage": "npm run test -- --coverage"
+ "test:coverage": "jest -c ./config/test/jest.coverage.js --verbose"
```

Let's play with some different reporting options. Add `coverageReporters` section as an array of strings in `jest.coverage.json`:

_./config/test/jest.coverage.js_

```diff
...
const base = require('./jest');

module.exports = {
  ...base,
  collectCoverage: true,
+ coverageReporters: ['text', 'html'],
};

```

We can configure a minimum threshold enforcement for coverage results. If thresholds aren't met, jest will fail.

_./config/test/jest.coverage.js_

```diff
...
  coverageReporters: ['text', 'html'],
+ coverageThreshold: {
+   global: {
+     branches: 80,
+     functions: 80,
+     lines: 80,
+     statements: -10,
+   },
+ },
};

```

> Update `functions` value to 100 or `statements` to `-3`.

- Let's comment some specs to see coverage:

_./src/pods/member-list/store/member-list.reducer.spec.ts_

```diff
...
- it('should return the expected state when action type is FETCH_MEMBERS_SUCCESS', () => {
+ xit('should return the expected state when action type is FETCH_MEMBERS_SUCCESS', () => {

  ...
- it('should return the expected state when action type is FETCH_MEMBERS_ERROR', () => {
+ xit('should return the expected state when action type is FETCH_MEMBERS_ERROR', () => {
```
> NOTE: check html coverage with yellow lines. (Not branches tested)

With the following configuration jest will fail if there is less than 80% branch, line, and function coverage, or if there are more than 10 uncovered statements.
We can also specify per-file or pattern configuration:

_./config/test/jest.coverage.js_

```diff
...
  coverageThreshold: {
    global: {
-     branches: 60,
+     branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
+   'src/**/*reducer.ts': {
+     branches: 100,
+   },
  },
};

```

- We can ignore some paths:


_./config/test/jest.coverage.js_

```diff
...
+ coveragePathIgnorePatterns: ['node_modules', 'src/common/test'],
```

Finally let's add another configuration entry. Suppose we have a project were we should cover every exported function or component like a library or game engine. By default only code coverage is reported for files than are tested. What about non-tested files? Let's edit the jest configuration make jest to complain about non tested files and add them a bad report. Since we're using TypeScript for our project adding `collectCoverageFrom` entry:

_./config/test/jest.coverage.js_

```diff
...
+ collectCoverageFrom: ['**/*.{ts,tsx}'],
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
