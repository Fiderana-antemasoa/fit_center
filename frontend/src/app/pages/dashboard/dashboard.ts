import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Membre, MembreService } from '../../services/membre.service';
import { Abonnement, AbonnementService } from '../../services/abonnement.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private membreService = inject(MembreService);
  private abonnementService = inject(AbonnementService);
  private cdr = inject(ChangeDetectorRef);

  membres: Membre[] = [];
  abonnements: Abonnement[] = [];

  totalMembres = 0;
  membresActifs = 0;
  abonnementsActifs = 0;
  revenusMois = 0;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.membreService.getAll().subscribe({
      next: (membres) => {
        this.membres = membres;
        this.totalMembres = membres.length;

        this.membresActifs = membres.filter(
          membre => membre.statut_membre.toUpperCase() === 'ACTIF'
        ).length;

        this.loadAbonnements();
      },
      error: (error) => {
        console.error('Erreur chargement membres :', error);

        this.errorMessage =
          'Impossible de charger les données du tableau de bord.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAbonnements(): void {
    this.abonnementService.getAll().subscribe({
      next: (abonnements) => {
        this.abonnements = abonnements;

        this.abonnementsActifs = abonnements.filter(
          abonnement =>
            abonnement.statut_abonnement.toUpperCase() === 'ACTIF'
        ).length;

        this.revenusMois = this.calculateMonthlyRevenue(abonnements);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement abonnements :', error);

        this.errorMessage =
          'Impossible de charger les données du tableau de bord.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateMonthlyRevenue(abonnements: Abonnement[]): number {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return abonnements
      .filter(abonnement => {
        const dateDebut = new Date(abonnement.date_debut);

        return (
          dateDebut.getFullYear() === currentYear &&
          dateDebut.getMonth() === currentMonth
        );
      })
      .reduce((total, abonnement) => {
        return total + Number(abonnement.prix);
      }, 0);
  }

  getRecentAbonnements(): Abonnement[] {
    return [...this.abonnements]
      .sort(
        (a, b) =>
          new Date(b.date_debut).getTime() -
          new Date(a.date_debut).getTime()
      )
      .slice(0, 5);
  }

  getMembreNom(membreId: number): string {
    const membre = this.membres.find(
      membre => membre.id === membreId
    );

    return membre ? membre.nom : 'Membre inconnu';
  }

  getToday(): string {
    return new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}