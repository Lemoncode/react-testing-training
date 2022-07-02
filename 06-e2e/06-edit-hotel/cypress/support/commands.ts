Cypress.Commands.add(
    'loadAndVisit',
    (apiPath: string, routePath: string, fixture?: string) => {
        // cy.intercept('GET', '/api/hotels').as('fetchHotels');
        // cy.visit('/hotel-collection');

        // cy.wait('@fetchHotels');
        !!fixture ?
            cy.intercept('GET', apiPath, { fixture }).as('load') :
            cy.intercept('GET', apiPath).as('load');
        
        cy.visit(routePath);
        cy.wait('@load');
    }
);