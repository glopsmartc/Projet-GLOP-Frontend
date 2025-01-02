describe('SignContractComponent', () => {
  beforeEach(() => {
    cy.visit('/sign-contract', {
      state: {
        selectedPlan: { 
          name: 'Plan Premium', 
          price: '100€', 
          description: 'Couverture mondiale\nSupport 24/7\nAnnulation sans frais' 
        },
        formData: { 
          dureeContrat: '12 mois', 
          debutContrat: '2024-01-01', 
          destination: 'Paris' 
        },
      },
    });
  });

  it('should open conditions dialog and accept terms', () => {
    cy.contains('conditions générales et la politique de confidentialité').click();
    cy.get('.dialog-header').should('contain', 'Conditions Générales');
    cy.get('button.close-btn').click();
    cy.get('input[type="checkbox"]').check();
  });

});
