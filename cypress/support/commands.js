Cypress.Commands.add("loginLeverancier", (username, password) => {
  Cypress.log({
    displayName: "login",
  });
  cy.intercept("/api/leverancier/login").as("login");
  cy.visit("http://localhost:5173/login");
  cy.get("[data-cy=gebruikersnaam_input]").clear().type(username);
  cy.get("[data-cy=password_input]").clear().type(password);
  cy.get("[data-cy=submit_btn]").click();
  cy.wait("@login");
});

Cypress.Commands.add("loginKlant", (username, password) => {
  Cypress.log({
    displayName: "login",
  });
  cy.intercept("/api/klant/login").as("login");
  cy.visit("http://localhost:5173/login");
  cy.get("[data-cy=gebruikersnaam_input]").clear().type(username);
  cy.get("[data-cy=password_input]").clear().type(password);
  cy.get("[data-cy=submit_btn]").click();
  cy.wait("@login");
});

Cypress.Commands.add("logout", () => {
  Cypress.log({
    displayName: "logout",
  });

  cy.visit("http://localhost:5173");
  cy.get("[data-cy=logout-btn]").click();
});
