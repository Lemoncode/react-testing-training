describe('Submodule list specs', () => {
  it('should navigate to login page when it visits submodule-list without login', () => {
    // Arrange

    // Act
    cy.visit('/submodule-list');

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/login');
  });

  it('should render two links for navigate to submodules when it visits submodule-list after login', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/submodule-list');
    cy.findByRole('link', { name: 'Proyectos'}).should('exist');
    cy.findByRole('link', { name: 'Empleados'}).should('exist');
  });

  it('should navigate to project list when it clicks on proyects button', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos'}).click();

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/projects');
  });

  it('should navigate to employee list when it clicks on employees button', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Empleados'}).click();

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/employees');
  });
});
