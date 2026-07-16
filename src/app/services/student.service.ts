import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);

  private readonly api =
    'http://localhost:5000/api/v1/students';

  create(student: Student): Observable<any> {
    return this.http.post(this.api, student);
  }

  getAll(
    page = 1,
    limit = 20,
    search = ''
  ): Observable<any> {

    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);

    return this.http.get(this.api, { params });

  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  update(
    id: string,
    student: Student
  ): Observable<any> {

    return this.http.put(
      `${this.api}/${id}`,
      student
    );

  }

  delete(id: string): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}
