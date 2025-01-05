import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-contracts.component.html',
  styleUrl: './client-contracts.component.css'
})
export class ClientContractsComponent {

  clients = [
    { nom: 'Dupont', prenom: 'Jean', telephone: '0612345678', email: 'jean.dupont@example.com' },
    { nom: 'Durand', prenom: 'Marie', telephone: '0623456789', email: 'marie.durand@example.com' },
    { nom: 'Martin', prenom: 'Paul', telephone: '0634567890', email: 'paul.martin@example.com' }
  ];

}
