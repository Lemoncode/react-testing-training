import { loadFeature, defineFeature } from 'jest-cucumber';
import { add, divide } from './calculator';

const feature = loadFeature('./src/calculator.feature');

defineFeature(feature, (scenario) => {
  let firstOperand, secondOperand, result;

  scenario(
    'Add the numbers <firstOperand> and <secondOperand> should return <result>',
    ({ given, and, when, then }) => {
      given(/^I have entered (.*) as the first operand$/, (first: string) => {
        firstOperand = Number(first);
      });
      and(/^I have entered (.*) as the second operand$/, (second: string) => {
        secondOperand = Number(second);
      });
      when('I add both numbers', () => {
        result = add(firstOperand, secondOperand);
      });
      then(/^The result should be (.*)$/, (expectedResult: string) => {
        expect(result).toEqual(Number(expectedResult));
      });
    }
  );

  scenario(
    'Divide the numbers <firstOperand> and <secondOperand> should return <result>',
    ({ given, and, when, then }) => {
      given(/^I have entered (.*) as the first operand$/, (first: string) => {
        firstOperand = Number(first);
      });
      and(/^I have entered (.*) as the second operand$/, (second: string) => {
        secondOperand = Number(second);
      });
      when('I divide both numbers', () => {
        result = divide(firstOperand, secondOperand);
      });
      then(/^The result should be (.*)$/, (expectedResult: string) => {
        if (expectedResult === 'undefined') {
          expect(result).toEqual(undefined);
        } else {
          expect(result).toEqual(Number(expectedResult));
        }
      });
    }
  );
});
