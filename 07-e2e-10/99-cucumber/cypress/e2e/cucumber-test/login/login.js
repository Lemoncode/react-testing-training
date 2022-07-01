import { Given, When, Then, And } from '@badeball/cypress-cucumber-preprocessor';

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
    cy.url().should('eq', 'http://localhost:8080/#/hotel-collection');
});
