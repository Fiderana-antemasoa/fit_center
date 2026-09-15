import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  Membre,
  MembreFormData,
  MembreService
} from '../../services/membre.service';

import {
  ConfirmationModal
} from '../../shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-membres',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    ConfirmationModal
  ],
  templateUrl: './membres.html',
  styleUrl: './membres.scss'
})
export class Membres implements OnInit {

  private membreService = inject(MembreService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // ==============================
  // État de la page
  // ==============================

  showForm = false;

  editingId: number | null = null;

  membres: Membre[] = [];

  loading = false;

  errorMessage = '';

  // ==============================
  // Popup suppression
  // ==============================

  showDeleteModal = false;

  membreToDelete: Membre | null = null;

  // ==============================
  // Popup succès
  // ==============================

  showSuccessModal = false;

  successMessage = '';

  // ==============================
  // Formulaire membre
  // ==============================

  membreForm = this.fb.group({
    nom: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    telephone: [
      '',
      Validators.maxLength(20)
    ],

    mail: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    dateInscription: [
      this.getToday(),
      Validators.required
    ],

    statutMembre: [
      'ACTIF',
      Validators.required
    ]
  });

  // ==============================
  // Initialisation
  // ==============================

  ngOnInit(): void {
    this.loadMembres();
  }

  // ==============================
  // Date du jour
  // ==============================

  getToday(): string {
    return new Date()
      .toISOString()
      .split('T')[0];
  }

  // ==============================
  // Charger les membres
  // ==============================

  loadMembres(): void {

    this.errorMessage = '';

    this.loading = true;

    console.log('Chargement des membres...');

    this.membreService.getAll().subscribe({

      next: (membres) => {

        console.log(
          'Membres reçus JSON :',
          JSON.stringify(membres)
        );

        console.log(
          'Nombre de membres :',
          membres.length
        );

        this.membres = membres;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Erreur GET membres :',
          error
        );

        this.errorMessage =
          'Impossible de charger les membres.';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }

  // ==============================
  // Ouvrir formulaire ajout
  // ==============================

  openForm(): void {

    this.editingId = null;

    this.membreForm.reset({

      nom: '',

      telephone: '',

      mail: '',

      dateInscription: this.getToday(),

      statutMembre: 'ACTIF'

    });

    this.showForm = true;
  }

  // ==============================
  // Modifier un membre
  // ==============================

  editMembre(membre: Membre): void {

    this.editingId = membre.id;

    this.membreForm.patchValue({

      nom: membre.nom,

      telephone: membre.telephone,

      mail: membre.mail,

      dateInscription:
        membre.date_inscription.split('T')[0],

      statutMembre:
        membre.statut_membre

    });

    this.showForm = true;
  }

  // ==============================
  // Fermer formulaire
  // ==============================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.membreForm.reset({

      nom: '',

      telephone: '',

      mail: '',

      dateInscription: this.getToday(),

      statutMembre: 'ACTIF'

    });
  }

  // ==============================
  // Ajouter / Modifier
  // ==============================

  submit(): void {

    if (this.membreForm.invalid) {

      this.membreForm.markAllAsTouched();

      return;
    }

    const value =
      this.membreForm.getRawValue();

    const data: MembreFormData = {

      nom: value.nom ?? '',

      telephone: value.telephone ?? '',

      mail: value.mail ?? '',

      dateInscription:
        value.dateInscription ??
        this.getToday(),

      statutMembre:
        value.statutMembre ??
        'ACTIF'

    };

    // ==============================
    // MODIFICATION
    // ==============================

    if (this.editingId !== null) {

      this.membreService
        .update(this.editingId, data)
        .subscribe({

          next: () => {

            this.closeForm();

            this.loadMembres();

            this.successMessage =
              `Le membre « ${data.nom} » a été modifié avec succès.`;

            this.showSuccessModal = true;
          },

          error: (error) => {

            console.error(
              'Erreur modification :',
              error
            );

            this.errorMessage =
              'Erreur lors de la modification du membre.';

            this.cdr.detectChanges();
          }

        });

      return;
    }

    // ==============================
    // AJOUT
    // ==============================

    this.membreService
      .create(data)
      .subscribe({

        next: () => {

          this.closeForm();

          this.loadMembres();

          this.successMessage =
            `Le membre « ${data.nom} » a été ajouté avec succès.`;

          this.showSuccessModal = true;
        },

        error: (error) => {

          console.error(
            'Erreur création :',
            error
          );

          this.errorMessage =
            'Erreur lors de la création du membre.';

          this.cdr.detectChanges();
        }

      });
  }

  // ==============================
  // Ouvrir popup suppression
  // ==============================

  deleteMembre(id: number): void {

    const membre =
      this.membres.find(
        m => m.id === id
      );

    if (!membre) {
      return;
    }

    this.membreToDelete = membre;

    this.showDeleteModal = true;
  }

  // ==============================
  // Confirmer suppression
  // ==============================

  confirmDelete(): void {

    if (!this.membreToDelete) {
      return;
    }

    const id =
      this.membreToDelete.id;

    const nom =
      this.membreToDelete.nom;

    this.membreService
      .delete(id)
      .subscribe({

        next: () => {

          this.showDeleteModal = false;

          this.membreToDelete = null;

          this.loadMembres();

          this.successMessage =
            `Le membre « ${nom} » a été supprimé avec succès.`;

          this.showSuccessModal = true;
        },

        error: (error) => {

          console.error(
            'Erreur suppression :',
            error
          );

          this.errorMessage =
            'Erreur lors de la suppression du membre.';

          this.showDeleteModal = false;

          this.membreToDelete = null;

          this.cdr.detectChanges();
        }

      });
  }

  // ==============================
  // Annuler suppression
  // ==============================

  cancelDelete(): void {

    this.showDeleteModal = false;

    this.membreToDelete = null;
  }

  // ==============================
  // Fermer popup succès
  // ==============================

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.successMessage = '';
  }
}