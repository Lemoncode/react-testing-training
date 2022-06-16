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

And('I type valid password', () => {
  password = 'test';
  cy.findByLabelText('Password').as('passwordInput');
  cy.get('@passwordInput').type(password);
});

Then('I should navigate to hotels page', () => {
  cy.url().should('eq', 'http://localhost:8080/#/hotel-collection');
});
