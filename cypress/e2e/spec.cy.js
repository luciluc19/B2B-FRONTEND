describe("Home page", () => {
  it("draait de applicatie", () => {
    cy.visit("http://localhost:5173");
    cy.get("img").should("exist");
  });
});

describe("Leveranicer Login", () => {
  beforeEach(() => {
    cy.loginLeverancier("leverancier2", "12345678");
  });
  it("should logout", () => {
    cy.logout();
  });
});

describe("Klant Login", () => {
  beforeEach(() => {
    cy.loginKlant("klant2", "12345678");
  });
  it("should logout", () => {
    cy.logout();
  });
});

describe("product bekijken", () => {
  beforeEach(() => {
    cy.loginKlant("klant2", "12345678");
  });
  it("bekijk product", () => {
    cy.get("[data-cy=bestellen_btn]").first().click();
    cy.get("[data-cy=kopen_btn]");
  });
});

describe("navigeren naar alle paginas", () => {
  beforeEach(() => {
    cy.loginKlant("klant2", "12345678");
  });
  it("bekijk notificaties", () => {
    cy.get("[data-cy=notificaties_btn]").click();
  });
  it("bekijk bestellingen", () => {
    cy.get("[data-cy=bestellingen_btn]").click();
  });
  it("bekijk producten", () => {
    cy.get("[data-cy=productennav_btn]").click();
  });
  it("bekijk profiel", () => {
    cy.get("[data-cy=profiel_btn]").click();
  });
});
