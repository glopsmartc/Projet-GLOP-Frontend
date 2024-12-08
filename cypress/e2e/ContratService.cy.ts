describe('ContratService Tests', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/contrat/getOffre', { fixture: 'exemple.json' }).as('getOffreRequest');
    });
  
    it('should get corresponding offer when sending a valid request', () => {
      cy.visit('/some-page'); 
  
      cy.wait('@getOffreRequest').its('response.statusCode').should('eq', 200);
  
      cy.window().then((window) => {
        const response = window.localStorage.getItem('offre');
        expect(response).to.include('Offre Premium');
      });
    });
  });
  