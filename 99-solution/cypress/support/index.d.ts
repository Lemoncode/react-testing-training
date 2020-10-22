declare namespace Cypress {
  interface Resource {
    path: string;
    fixture?: string;
    alias?: string;
  }

  interface Chainable {
    loadAndVisit(
      visitUrl: string,
      resources: Resource[],
      callbackAfterVisit?: () => void
    ): Chainable<Element>;

    login(user: string, password: string): Chainable<Element>;
  }
}
