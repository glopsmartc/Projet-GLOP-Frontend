import { Component, OnInit } from '@angular/core';
import { PartenaireService } from '../../services/partenaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partenaire-list',
  templateUrl: './partenaires-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./partenaires-list.component.css']
})
export class PartenairesListComponent implements OnInit {
  partenaires: any[] = [];  // Liste des partenaires
  searchText: string = '';  // Texte de recherche
  isLoading: boolean = false;  // Indicateur de chargement
  errorMessage: string | null = null;  // Message d'erreur

  isAdding: boolean = false;  // Affichage du formulaire d'ajout
  newPartenaire: any = {};  // Données du nouveau partenaire

  partenaireEnCours: any = null;  // Partenaire en cours de modification
  isEditing: boolean = false;  // Affichage du formulaire d'édition

  constructor(private partenaireService: PartenaireService) {}

  ngOnInit(): void {
    this.loadPartenaires();  // Charger les partenaires au démarrage
  }

  // Charger tous les partenaires depuis le service
  async loadPartenaires() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      this.partenaires = await this.partenaireService.getAllPartenaires();
    } catch (error) {
      this.errorMessage = 'Erreur lors du chargement des partenaires.';
    } finally {
      this.isLoading = false;
    }
  }

  // Supprimer un partenaire
  async deletePartenaire(id: number) {
    if (!id) {
      console.error('Erreur: ID du partenaire est invalide:', id);
      return;
    }
    console.log('ID du partenaire à supprimer:', id);
    if (confirm('Voulez-vous vraiment supprimer ce partenaire ?')) {
      try {
        await this.partenaireService.deletePartenaire(id);
        this.partenaires = this.partenaires.filter(p => p.idSousPartenaire !== id);
      } catch (error) {
        this.errorMessage = 'Erreur lors de la suppression du partenaire.';
      }
    }
  }

  // Ouvrir le formulaire d'édition
  editPartenaire(partenaire: any) {
    this.partenaireEnCours = { ...partenaire };  // Copie des données du partenaire
    this.isEditing = true;
  }

  // Sauvegarder les modifications
  async savePartenaire() {
    if (this.partenaireEnCours) {
      try {
        await this.partenaireService.updatePartenaire(this.partenaireEnCours.idSousPartenaire, this.partenaireEnCours);
        this.isEditing = false;
        this.partenaireEnCours = null;
        this.loadPartenaires();  // Rafraîchir la liste des partenaires
      } catch (error) {
        this.errorMessage = 'Erreur lors de la modification du partenaire.';
      }
    }
  }

  // Annuler l'édition
  cancelEdit() {
    this.isEditing = false;
    this.partenaireEnCours = null;
  }

  // Démarrer l'ajout d'un partenaire
  startAdding() {
    this.isAdding = true;
    this.newPartenaire = {};  // Réinitialiser les données du formulaire
  }

  // Annuler l'ajout
  cancelAdd() {
    this.isAdding = false;
    this.newPartenaire = {};  // Réinitialiser les données du formulaire
  }

  // Ajouter un nouveau partenaire
  async addPartenaire() {
    try {
      await this.partenaireService.addPartenaire(this.newPartenaire);
      this.loadPartenaires();  // Rafraîchir la liste après ajout
      this.cancelAdd();  // Fermer le formulaire d'ajout
    } catch (error) {
      this.errorMessage = 'Erreur lors de l\'ajout du partenaire.';
    }
  }

  // Getter pour les partenaires filtrés
  get filteredPartenaires() {
    return this.partenaires.filter(partenaire =>
      Object.values(partenaire).some((value: unknown) =>
        typeof value === 'string' && value.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
