describe('Header Component', () => {

    beforeEach(() => {
      cy.clearLocalStorage();
    });
  
    it('should redirect to the login page on logout', () => {
      cy.window().then((window) => {
        window.localStorage.setItem('authToken', 'dummy_token');
      });
  
      cy.visit('/');
  
      cy.get('a.nav-link.btn.btn-customer.text-white').click();
  
      cy.url().should('include', '/login');
    });
  
  
    it('should not allow access to restricted pages without authentication', () => {
      cy.visit('/subscription-form');
  
      cy.url().should('include', '/login');
    });
  
  });
  