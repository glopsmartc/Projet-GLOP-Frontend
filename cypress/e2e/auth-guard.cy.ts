describe('Auth Guard Tests', () => {
    it('devrait rediriger vers /login si non authentifié', () => {
        localStorage.removeItem('token');

        cy.intercept('GET', '/api/check-auth', {
            statusCode: 401,
            body: { message: 'Unauthorized' },
        });

        cy.visit('/protected-route'); 

        cy.wait(2000); 

        cy.url().should('include', '/login');
    });
});
