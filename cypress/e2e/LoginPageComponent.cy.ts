describe('Login Page Component', () => {
    const baseUrl = 'http://localhost:4200';
  
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the sign-up form and allow user registration', () => {
      cy.get('button').contains('Créer un compte').click(); 
  
      cy.get('form').contains('Créer un compte').closest('form').within(() => {
        cy.get('input[name="lastName"]').type('Doe');
        cy.get('input[name="firstName"]').type('John');
        cy.get('input[name="emailSignUp"]').type('john.doe@example.com');
        cy.get('input[name="address"]').type('123 Main Street');
        cy.get('input[name="phoneNumber"]').type('+33612345678');
        cy.get('input[name="birthDate"]').type('2000-01-01');
        cy.get('input[name="passwordSignUp"]').type('Password123!');
        cy.get('input[name="confirmPassword"]').type('Password123!');
        cy.get('button[type="submit"]').click();
      });
  
      cy.get('span').should('not.contain', 'Complétez tous les champs obligatoires.');
      cy.log('User successfully registered.');
    });
  
    it('should display an error message if login fails', () => {
      cy.get('button').contains('Se connecter').click();
  
      cy.get('form').contains('Se connecter').closest('form').within(() => {
        cy.get('input[name="emailSignIn"]').type('wrong.email@example.com');
        cy.get('input[name="passwordSignIn"]').type('WrongPassword!');
        cy.get('button[type="submit"]').click();
      });
  
      cy.get('span').should('contain', 'Échec de la connexion. Veuillez vérifier votre e-mail et votre mot de passe.');
    });
  });
  