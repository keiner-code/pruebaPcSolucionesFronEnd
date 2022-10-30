import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import {EmpleadoService} from '../../services/empleado.service';
import { Empleado } from '../../models/empleado.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-empleado',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  empleado: Empleado[] | [] = [];
  showCreate = false;
  exits = false;
  constructor(
    private empleadoService: EmpleadoService,
    private formBuilder: FormBuilder,
    ) {
      this.buildForm();
    }

  ngOnInit(): void {
    this.showEmpleado();
  }
  showEmpleado(){
    this.empleadoService.getAll()
    .subscribe(data => {
      const validos = data.filter(item => item.estado !== 'invalido')
     this.empleado = validos;
    });
  }
  editar(data: any) {
     const empleado = {
      nombre_completo: String(data.name.value),
      edad: Number(data.age.value),
      apto: String(data.apto.value),
      estado: String(data.state.value),
      password: String(data.password.value),
      departamento: String(data.departaments.value),
      identificacion: String(data.identificacion.value),
    }
    this.empleadoService.editar(empleado,data.id.value)
    .subscribe({complete: () => this.success('edit')});
  }
  success(status: string) {
      if (status == 'edit')alert('Producto modificado');
      if (status == 'delete')alert('Producto Eliminado');
      if (status == 'create')alert('Producto Creado');
  }
  remove(id: string) {
    this.empleadoService.getOne(Number(id))
    .pipe(
      switchMap((empleado) => {
        if(empleado){
          return this.empleadoService.editar({
            ...empleado,
            estado: 'invalido'
          },empleado.id)
        }else{
          return [null];
        }
      })
    )
    .subscribe(() => {
      this.showEmpleado();
    });
  }
  showCreateEmpleado(){
    this.showCreate = !this.showCreate;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      identificacion: ['',[Validators.required,Validators.maxLength(8)]],
      nombre_completo: ['',[Validators.required]],
      edad: [0,[Validators.required]],
      apto: [false,[Validators.requiredTrue]],
      estado: ['',[Validators.required]],
      password: ['',[Validators.required]],
      departamento: ['',[Validators.required]],
    })
  }
  create(event: Event) {
    event.preventDefault();
    this.empleadoService.create(this.form.value)
    .subscribe({
      complete: () => this.success('create')
    });
    this.form.reset();
    this.showEmpleado();
    this.showCreate = !this.showCreate;
  }

  get identificationField() {
    const value = this.form.get('identificacion')?.value;
    //const status = this.form.get('identificacion')?.status;
    this.empleado.map(item => {
      if(item.identificacion == value){
        //this.form.get('identificacion')?.hasError('repetida'); */
        this.exits = true;
      }
    })
    return this.form.get('identificacion')
  }
  get nombre_completoField() {return this.form.get('nombre_completo')}
  get edadField() {return this.form.get('edad')}
  get aptoField() {return this.form.get('apto')}
  get estadoField() {return this.form.get('estado')}
  get passwordField() {return this.form.get('password')}
  get departamentoField() {return this.form.get('departamento')}
}
