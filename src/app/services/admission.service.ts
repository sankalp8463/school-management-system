import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdmissionApplication {
  id?: string;
  applicant: string;
  className: string;
  parent: string;
  phone: string;
  source: string;
  stage: string;
  owner: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  private http = inject(HttpClient);

  private readonly api =
    'http://localhost:5000/api/v1/admission';

  /**
   * Create Admission
   */
  create(data: AdmissionApplication): Observable<any> {
    return this.http.post(this.api, data);
  }

  /**
   * Get All Admissions
   */
  getAll(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<any> {

    return this.http.get(this.api, {
      params: {
        page,
        limit,
        search
      }
    });

  }

  /**
   * Get By Id
   */
  getById(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  /**
   * Update
   */
  update(
    id: string,
    data: AdmissionApplication
  ): Observable<any> {

    return this.http.put(
      `${this.api}/${id}`,
      data
    );

  }

  /**
   * Delete
   */
  delete(id: string): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}
