import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado,EditEmpleado } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = 'http://localhost:3000/api/v1/empleado';
  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<Empleado[]>(this.apiUrl);
  }
  getOne(id: number){
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }
  editar(body: EditEmpleado, id: number){
    return this.http.put(`${this.apiUrl}/${id}`,body);
  }
  create(payload: Empleado) {
    return this.http.post<Empleado>(this.apiUrl,payload);
  }
}
