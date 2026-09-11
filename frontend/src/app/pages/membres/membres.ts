import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Membre, MembreFormData, MembreService } from '../../services/membre.service';

@Component({
  selector: 'app-membres',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './membres.html',
  styleUrl: './membres.scss'
})
export class Membres implements OnInit {
  private membreService = inject(MembreService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  showForm = false;
  editingId: number | null = null;
  membres: Membre[] = [];
  loading = false;
  errorMessage = '';

  membreForm = this.fb.group({
    nom: ['', [Validators.required, Validators.maxLength(100)]],
    telephone: ['', Validators.maxLength(20)],
    mail: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    dateInscription: [this.getToday(), Validators.required],
    statutMembre: ['ACTIF', Validators.required]
  });

  ngOnInit(): void {
    this.loadMembres();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadMembres(): void {
    this.errorMessage = '';
    this.loading = true;

    console.log('Chargement des membres...');

    this.membreService.getAll().subscribe({
      next: (membres) => {
        console.log('Membres reçus JSON :', JSON.stringify(membres));
        console.log('Nombre de membres :', membres.length);

        this.membres = membres;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur GET membres :', error);

        this.errorMessage = 'Impossible de charger les membres.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

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

  editMembre(membre: Membre): void {
    this.editingId = membre.id;

    this.membreForm.patchValue({
      nom: membre.nom,
      telephone: membre.telephone,
      mail: membre.mail,
      dateInscription: membre.date_inscription.split('T')[0],
      statutMembre: membre.statut_membre
    });

    this.showForm = true;
  }

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

  submit(): void {
    if (this.membreForm.invalid) {
      this.membreForm.markAllAsTouched();
      return;
    }

    const value = this.membreForm.getRawValue();

    const data: MembreFormData = {
      nom: value.nom ?? '',
      telephone: value.telephone ?? '',
      mail: value.mail ?? '',
      dateInscription: value.dateInscription ?? this.getToday(),
      statutMembre: value.statutMembre ?? 'ACTIF'
    };

    if (this.editingId !== null) {
      this.membreService.update(this.editingId, data).subscribe({
        next: () => {
          this.closeForm();
          this.loadMembres();
        },
        error: (error) => {
          console.error('Erreur modification :', error);
          this.errorMessage = 'Erreur lors de la modification du membre.';
          this.cdr.detectChanges();
        }
      });

      return;
    }

    this.membreService.create(data).subscribe({
      next: () => {
        this.closeForm();
        this.loadMembres();
      },
      error: (error) => {
        console.error('Erreur création :', error);
        this.errorMessage = 'Erreur lors de la création du membre.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteMembre(id: number): void {
    const membre = this.membres.find(m => m.id === id);

    if (!membre) {
      return;
    }

    const confirmed = confirm(
      `Voulez-vous supprimer le membre "${membre.nom}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.membreService.delete(id).subscribe({
      next: () => {
        this.loadMembres();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage = 'Erreur lors de la suppression du membre.';
        this.cdr.detectChanges();
      }
    });
  }
}