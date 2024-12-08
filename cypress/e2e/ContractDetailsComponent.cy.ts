describe('Routing and Component Tests', () => {

    beforeEach(() => {
      cy.clearLocalStorage();
    });
  
    it('should navigate to login if not authenticated', () => {
      cy.visit('/subscription-form'); 
      cy.url().should('include', '/login'); 
    });
  
    it('should navigate to sign contract page', () => {
      cy.visit('/sign-contract');
  
      cy.get('app-sign-contract').should('exist');
    });
  
    it('should redirect to login if an invalid route is accessed', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false });
  
      cy.url().should('eq', 'http://localhost:4200/login');
    });
  
  });
  