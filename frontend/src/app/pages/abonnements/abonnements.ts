import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MembreService,
  Membre
} from '../../services/membre.service';

import {
  Abonnement,
  AbonnementFormData,
  AbonnementService
} from '../../services/abonnement.service';

import {
  ConfirmationModal
} from '../../shared/confirmation-modal/confirmation-modal';


@Component({
  selector: 'app-abonnements',

  imports: [
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    ConfirmationModal
  ],

  templateUrl: './abonnements.html',

  styleUrl: './abonnements.scss'
})
export class Abonnements implements OnInit {

  private abonnementService =
    inject(AbonnementService);

  private membreService =
    inject(MembreService);

  private fb =
    inject(FormBuilder);

  private cdr =
    inject(ChangeDetectorRef);


  // =========================================================
  // ÉTAT DE LA PAGE
  // =========================================================

  showForm = false;

  editingId: number | null = null;

  abonnements: Abonnement[] = [];

  membres: Membre[] = [];

  loading = false;

  errorMessage = '';


  // =========================================================
  // POPUP DE SUPPRESSION
  // =========================================================

  showDeleteModal = false;

  abonnementToDelete: Abonnement | null = null;


  // =========================================================
  // POPUP DE SUCCÈS
  // =========================================================

  showSuccessModal = false;

  successMessage = '';


  // =========================================================
  // FORMULAIRE
  // =========================================================

  abonnementForm = this.fb.group({

    type: [
      '',
      Validators.required
    ],

    dateDebut: [
      this.getToday(),
      Validators.required
    ],

    dateFin: [
      this.getToday(),
      Validators.required
    ],

    prix: [
      null as number | null,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    statutAbonnement: [
      'ACTIF',
      Validators.required
    ],

    membreId: [
      null as number | null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]

  });


  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {

    this.loadAbonnements();

    this.loadMembres();

  }


  // =========================================================
  // CHARGER LES ABONNEMENTS
  // =========================================================

  loadAbonnements(): void {

    this.errorMessage = '';

    this.loading = true;

    this.abonnementService
      .getAll()
      .subscribe({

        next: (abonnements) => {

          console.log(
            'Abonnements reçus :',
            abonnements
          );

          this.abonnements =
            abonnements;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur GET abonnements :',
            error
          );

          this.errorMessage =
            'Impossible de charger les abonnements.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CHARGER LES MEMBRES
  // =========================================================

  loadMembres(): void {

    this.membreService
      .getAll()
      .subscribe({

        next: (membres) => {

          console.log(
            'Membres reçus :',
            membres
          );

          this.membres =
            membres;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur chargement membres :',
            error
          );

        }

      });

  }


  // =========================================================
  // OUVRIR LE FORMULAIRE
  // =========================================================

  openForm(): void {

    this.editingId = null;

    this.abonnementForm.reset({

      type: '',

      dateDebut:
        this.getToday(),

      dateFin:
        this.getToday(),

      prix: null,

      statutAbonnement:
        'ACTIF',

      membreId: null

    });

    this.showForm = true;

  }


  // =========================================================
  // MODIFIER UN ABONNEMENT
  // =========================================================

  editAbonnement(
    abonnement: Abonnement
  ): void {

    this.editingId =
      abonnement.id;

    this.abonnementForm.patchValue({

      type:
        abonnement.type,

      dateDebut:
        abonnement.date_debut
          .split('T')[0],

      dateFin:
        abonnement.date_fin
          .split('T')[0],

      prix:
        Number(abonnement.prix),

      statutAbonnement:
        abonnement.statut_abonnement,

      membreId:
        abonnement.membre_id

    });

    this.showForm = true;

  }


  // =========================================================
  // FERMER LE FORMULAIRE
  // =========================================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.abonnementForm.reset({

      type: '',

      dateDebut:
        this.getToday(),

      dateFin:
        this.getToday(),

      prix: null,

      statutAbonnement:
        'ACTIF',

      membreId: null

    });

  }


  // =========================================================
  // AJOUTER / MODIFIER
  // =========================================================

  submit(): void {

    if (this.abonnementForm.invalid) {

      this.abonnementForm
        .markAllAsTouched();

      return;

    }


    const value =
      this.abonnementForm
        .getRawValue();


    if (
      value.prix === null ||
      value.membreId === null
    ) {

      return;

    }


    const data: AbonnementFormData = {

      type:
        value.type ?? '',

      dateDebut:
        value.dateDebut ??
        this.getToday(),

      dateFin:
        value.dateFin ??
        this.getToday(),

      prix:
        Number(value.prix),

      statutAbonnement:
        value.statutAbonnement ??
        'ACTIF',

      membreId:
        Number(value.membreId)

    };


    console.log(
      'Données abonnement envoyées :',
      data
    );


    // =======================================================
    // MODIFICATION
    // =======================================================

    if (this.editingId !== null) {

      this.abonnementService
        .update(
          this.editingId,
          data
        )
        .subscribe({

          next: (abonnement) => {

            console.log(
              'Abonnement modifié :',
              abonnement
            );


            this.closeForm();

            this.loadAbonnements();


            this.successMessage =
              `L'abonnement « ${data.type} » a été modifié avec succès.`;

            this.showSuccessModal =
              true;

          },

          error: (error) => {

            console.error(
              'Erreur modification abonnement :',
              error
            );

            this.errorMessage =
              "Erreur lors de la modification de l'abonnement.";

            this.cdr.detectChanges();

          }

        });

      return;

    }


    // =======================================================
    // AJOUT
    // =======================================================

    this.abonnementService
      .create(data)
      .subscribe({

        next: (abonnement) => {

          console.log(
            'Abonnement créé :',
            abonnement
          );


          this.closeForm();

          this.loadAbonnements();


          this.successMessage =
            `L'abonnement « ${data.type} » a été ajouté avec succès.`;

          this.showSuccessModal =
            true;

        },

        error: (error) => {

          console.error(
            'Erreur création abonnement :',
            error
          );

          this.errorMessage =
            "Erreur lors de la création de l'abonnement.";

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // OUVRIR POPUP DE SUPPRESSION
  // =========================================================

  deleteAbonnement(
    id: number
  ): void {

    const abonnement =
      this.abonnements.find(
        item => item.id === id
      );


    if (!abonnement) {

      return;

    }


    this.abonnementToDelete =
      abonnement;

    this.showDeleteModal =
      true;

  }


  // =========================================================
  // CONFIRMER SUPPRESSION
  // =========================================================

  confirmDelete(): void {

    if (!this.abonnementToDelete) {

      return;

    }


    const id =
      this.abonnementToDelete.id;


    const membreNom =
      this.abonnementToDelete.membre?.nom ??
      this.getMembreNom(
        this.abonnementToDelete.membre_id
      );


    this.abonnementService
      .delete(id)
      .subscribe({

        next: () => {

          this.showDeleteModal =
            false;

          this.abonnementToDelete =
            null;


          this.loadAbonnements();


          this.successMessage =
            `L'abonnement de « ${membreNom} » a été supprimé avec succès.`;


          this.showSuccessModal =
            true;

        },

        error: (error) => {

          console.error(
            'Erreur suppression abonnement :',
            error
          );

          this.errorMessage =
            "Erreur lors de la suppression de l'abonnement.";

          this.showDeleteModal =
            false;

          this.abonnementToDelete =
            null;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // ANNULER SUPPRESSION
  // =========================================================

  cancelDelete(): void {

    this.showDeleteModal =
      false;

    this.abonnementToDelete =
      null;

  }


  // =========================================================
  // FERMER POPUP SUCCÈS
  // =========================================================

  closeSuccessModal(): void {

    this.showSuccessModal =
      false;

    this.successMessage =
      '';

  }


  // =========================================================
  // NOM DU MEMBRE
  // =========================================================

  getMembreNom(
    membreId: number
  ): string {

    const membre =
      this.membres.find(
        membre =>
          membre.id === membreId
      );


    return membre
      ? membre.nom
      : 'Membre inconnu';

  }


  // =========================================================
  // DATE DU JOUR
  // =========================================================

  getToday(): string {

    return new Date()
      .toISOString()
      .split('T')[0];

  }

}