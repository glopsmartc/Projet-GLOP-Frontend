describe('Forgot Password Component', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should load the Forgot Password page', () => {
    cy.visit('/forgot-password');
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });


  it('should display error message if the reset request fails', () => {
    cy.visit('/forgot-password');
    
    cy.get('input[type="email"]').type('test@example.com');
    
    cy.intercept('POST', '/auth/forgot-password', {
      statusCode: 500,
      body: { error: 'Failed to send reset email' }
    }).as('forgotPasswordRequest');
    
    cy.get('form').submit();
    
    cy.wait('@forgotPasswordRequest');
    
    cy.contains('Failed to send reset email. Please try again.').should('exist');
  });

});
