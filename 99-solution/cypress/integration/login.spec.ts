describe('Login scene specs', () => {
  it('should show validations errors when it clicks login button without fill the form', () => {
    // Arrange

    // Act
    cy.visit('/');
    cy.findByRole('button', { name: 'Login' }).click();

    // Assert
    cy.findAllByText('Debe informar el campo').should('have.length', 2);
  });

  it('should show alert error when it fills the form with invalid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = '1234';

    // Act
    cy.login(user, password);

    // Assert
    cy.findByText('Usuario y/o password no válidos');
  });

  it('should navigate to submodule-list when it fills the form with valid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/submodule-list');
  });
});
