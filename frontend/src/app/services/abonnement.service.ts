import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MembreSimple {
  id: number;
  nom: string;
}

export interface Abonnement {
  id: number;
  type: string;
  date_debut: string;
  date_fin: string;
  prix: number;
  statut_abonnement: string;
  membre_id: number;
  membre?: MembreSimple;
}

export interface AbonnementFormData {
  type: string;
  dateDebut: string;
  dateFin: string;
  prix: number;
  statutAbonnement: string;
  membreId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/abonnements';

  getAll(): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(this.apiUrl);
  }

  getById(id: number): Observable<Abonnement> {
    return this.http.get<Abonnement>(`${this.apiUrl}/${id}`);
  }

  create(data: AbonnementFormData): Observable<Abonnement> {
    return this.http.post<Abonnement>(this.apiUrl, data);
  }

  update(id: number, data: AbonnementFormData): Observable<Abonnement> {
    return this.http.put<Abonnement>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}