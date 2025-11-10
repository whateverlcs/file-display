// video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pasta, Subpasta, Arquivo, FileChecked, AssistidoResponse } from '../models/index';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPastas(): Observable<Pasta[]> {
    return this.http.get<Pasta[]>(`${this.apiUrl}/api/files/pastas`).pipe(
      catchError((err) => {
        return of([]);
      })
    );
  }

  getSubpastas(pastaPrincipal: string): Observable<Subpasta[]> {
    const params = new HttpParams().set('pastaPrincipal', pastaPrincipal);

    return this.http.get<Subpasta[]>(`${this.apiUrl}/api/files/subpastas`, { params }).pipe(
      catchError((err) => {
        return of([]);
      })
    );
  }

  postChecked(payload: FileChecked): Observable<AssistidoResponse> {
    return this.http
      .post<AssistidoResponse>(`${this.apiUrl}/api/files/mark-assistido`, payload)
      .pipe(
        catchError((err) => {
          return of({ message: 'Erro ao marcar como assistido' });
        })
      );
  }

  getArquivoUrl(arquivo: Arquivo): string {
    return `${this.apiUrl}${arquivo.caminho}`;
  }
}
