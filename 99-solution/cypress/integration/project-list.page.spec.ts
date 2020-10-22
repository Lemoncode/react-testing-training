import {} from '@testing-library/cypress';

describe('Project list page specs', () => {
  it('should navigate to login page when it visits projects without login', () => {
    // Arrange

    // Act
    cy.visit('/projects');

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/login');
  });

  it('should navigate to projects page when it visits projects after login', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/projects');
  });

  it('should render search-bar when it visits projects page', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.findByPlaceholderText('Buscar proyecto').should('exist');
  });

  it('should render project list with one header,five body rows when it visits projects page', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.findAllByRole('rowgroup')
      .should('have.length', 2)
      .then((rowGroups) => {
        cy.findByRole('row', { container: rowGroups[0] }).should('exist');
        cy.findAllByRole('row', { container: rowGroups[1] }).should(
          'have.length',
          5
        );
      });
  });

  it('should render project list with two pages in pagination when it visits projects page', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.findAllByRole('listitem')
      .should('have.length', 4)
      .then((list) => {
        cy.findByRole('button', {
          container: list[0],
          name: /Go to previous page/i,
        }).should('exist');
        cy.findByRole('button', { container: list[1], name: /page 1/i }).should(
          'exist'
        );
        cy.findByRole('button', { container: list[2], name: /page 2/i }).should(
          'exist'
        );
        cy.findByRole('button', {
          container: list[3],
          name: /Go to next page/i,
        }).should('exist');
      });
  });

  it('should render project list with three rows on body when it navigates to second page', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();
    cy.findByRole('button', { name: /page 2/i }).click();

    // Assert
    cy.findAllByRole('rowgroup').then((rowGroups) => {
      cy.findByRole('row', { container: rowGroups[0] }).should('exist');
      cy.findAllByRole('row', { container: rowGroups[1] }).should(
        'have.length',
        3
      );
    });
  });

  it('should navigate to Bankia edit project page when it clicks on Bankia edit button', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.findByRole('row', { name: /Bankia/i, exact: false }).within(() => {
      cy.findByRole('button', { name: 'Edit button' }).click();
      cy.url().should('equal', 'http://localhost:8080/#/projects/1');
    });
  });

  it('should show confirmation dialog when it clicks on Bankia delete button', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();

    // Assert
    cy.findByRole('row', { name: /Bankia/i, exact: false }).within(() => {
      cy.findByRole('button', { name: 'Delete button' }).click();
    });
    cy.findByRole('dialog').within(() => {
      cy.findByRole('heading', { name: 'Eliminar Proyecto' });
      cy.findByText('Bankia');
    });
  });

  it('should not delete Bankia project when it clicks on Bankia delete button and cancel', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();
    cy.findByRole('row', { name: /Bankia/i, exact: false }).within(() => {
      cy.findByRole('button', { name: 'Delete button' }).click();
    });
    cy.findByRole('dialog').within(() => {
      cy.findByRole('heading', { name: 'Eliminar Proyecto' });
      cy.findByText('Bankia');
      cy.findByRole('button', { name: 'Cancelar' }).click();
    });

    // Assert
    cy.findByRole('row', { name: /Bankia/i, exact: false }).should('exist');
  });

  it('should delete Bankia project when it clicks on Bankia delete button and confirm', () => {
    // Arrange
    const user = 'admin';
    const password = 'test';

    // Act
    cy.login(user, password);
    cy.findByRole('link', { name: 'Proyectos' }).click();
    cy.findByRole('row', { name: /Bankia/i, exact: false }).within(() => {
      cy.findByRole('button', { name: 'Delete button' }).click();
    });
    cy.findByRole('dialog').within(() => {
      cy.findByRole('heading', { name: 'Eliminar Proyecto' });
      cy.findByText('Bankia');
      cy.findByRole('button', { name: 'Aceptar' }).click();
    });

    // Assert
    cy.findByRole('row', { name: /Bankia/i, exact: false }).should('not.exist');
  });
});
