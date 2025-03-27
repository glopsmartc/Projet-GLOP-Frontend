import { Component, OnInit } from '@angular/core';
import { PartenaireService } from '../../services/partenaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partners-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.css'
})
export class PartnersListComponent implements OnInit {
  partenaires: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchText: string = '';
  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private readonly partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.loadPartenaires();
  }

  async loadPartenaires() {
    this.isLoading = true;
    this.errorMessage = null;
    this.partenaires = []; 
    try {
      this.partenaires = await this.partenaireService.getAllPartenaires();
      console.log('Partenaires chargés:', this.partenaires);
    } catch (error) {
      this.partenaires = []; 
      this.errorMessage = 'Erreur lors du chargement des partenaires. Veuillez réessayer plus tard.';
    } finally {
      this.isLoading = false;
    }
  }

  filteredPartenaires() {
    if (!this.searchText) {
      return this.partenaires;
    }
    return this.partenaires.filter(partenaire =>
      (partenaire.nom + ' ' + partenaire.prenom).toLowerCase().includes(this.searchText.toLowerCase()) ||
      partenaire.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      partenaire.numTel?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
  }

  sortedPartenaires() {
    return this.filteredPartenaires().sort((a, b) => {
      const valueA = a[this.sortColumn] ? a[this.sortColumn].toString().toLowerCase() : '';
      const valueB = b[this.sortColumn] ? b[this.sortColumn].toString().toLowerCase() : '';
      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }
}
