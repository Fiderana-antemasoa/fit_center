import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Membre {
  id: number;
  nom: string;
  telephone: string;
  mail: string;
  date_inscription: string;
  statut_membre: string;
}

export interface MembreFormData {
  nom: string;
  telephone: string;
  mail: string;
  dateInscription: string;
  statutMembre: string;
}

@Injectable({
  providedIn: 'root'
})
export class MembreService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fit-center.onrender.com/api/membres';

  getAll(): Observable<Membre[]> {
    return this.http.get<Membre[]>(this.apiUrl);
  }

  getById(id: number): Observable<Membre> {
    return this.http.get<Membre>(`${this.apiUrl}/${id}`);
  }

  create(data: MembreFormData): Observable<Membre> {
    return this.http.post<Membre>(this.apiUrl, data);
  }

  update(id: number, data: MembreFormData): Observable<Membre> {
    return this.http.put<Membre>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}