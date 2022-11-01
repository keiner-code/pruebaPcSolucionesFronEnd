import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado.model';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-empleado',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  empleado: Empleado[] | [] = [];
  selectDepartament = '';
  departaments = [
    {
      value: 'Atlantico',
      select: '',
    },
    {
      value: 'Sucre',
      select: '',
    },
    {
      value: 'Bolivar',
      select: '',
    },
  ];
  showCreate = false;
  exits = false;
  styleError = {
    color: 'red',
    marginInlineStart: '1.5rem',
    display: 'block',
  };

  constructor(
    private empleadoService: EmpleadoService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.showEmpleado();
  }
  showEmpleado() {
    this.empleadoService.getAll().subscribe((data) => {
      const empleadosValidos = data.filter(
        (item) => item.estado !== 'invalido'
      );
      this.empleado = empleadosValidos;
    });
  }

  editar(data: any) {
    const result = this.validacionesTabla(data);
    const empleado = {
      nombre_completo: String(data.name.value),
      edad: Number(data.age.value),
      apto: String(data.apto.value),
      estado: String(data.state.value),
      password: String(data.password.value),
      departamento: String(data.departament.value),
      identificacion: String(data.identificacion.value),
    };
    if (result) {
      this.empleadoService.editar(empleado, data.id.value).subscribe(() => {
        this.success('edit');
        this.showEmpleado();
      });
    }
  }
  success(status: string) {
    if (status == 'edit') alert('Empleado modificado');
    if (status == 'delete') alert('Empleado Eliminado');
    if (status == 'create') alert('Empleado Creado');
    if (status == 'repeat') alert('Identificacion Repetida');
    if (status == 'ageValue') alert('La Edad Requerida Es De 18 A 80 Años');
    if (status == 'passLength')
      alert('La Contraseña Debe Tener Minimo 8 Caracteres');
    if (status == 'identLength')
      alert('La Identificacion Debe Tener Minimo 8 Caracteres');
    if (status == 'identRepeat')
      alert('La Identificacion No Debe Estar Repetida Con Los Demas Empleados');
  }
  validacionIdentRepetida(data: any): boolean {
    const result = this.empleado.filter(
      (item) => item.identificacion == data.identificacion
    );
    if (result.length) {
      this.success('repeat');
      return false;
    }
    return true;
  }
  validacionesTabla(data: any): boolean {
    const edad = Number(data.age.value);
    const password = String(data.password.value);
    const identificacion = String(data.identificacion.value);
    const id = Number(data.id.value);
    const excluirEmpleado = this.empleado.filter((item) => item.id != id);

    if (!(edad >= 18 && edad <= 80)) {
      this.success('ageValue');
      return false;
    }
    if (password.length < 8) {
      this.success('passLength');
      return false;
    }
    if (!(identificacion.length >= 8 && identificacion.length <= 10)) {
      this.success('identLength');
      return false;
    }
    const result = excluirEmpleado.filter(
      (item) => item.identificacion == identificacion
    );
    if (result.length) {
      this.success('identRepeat');
      return false;
    }
    return true;
  }
  create(event: Event) {
    const result = this.validacionIdentRepetida(this.form.value);
    event.preventDefault();
    if (result) {
      this.form.value.apto = 'ok';
      this.empleadoService.create(this.form.value).subscribe({
        complete: () => this.success('create'),
      });
      this.form.reset();
      this.showCreate = !this.showCreate;
      this.showEmpleado();
    }
  }
  remove(id: string) {
    this.empleadoService
      .getOne(Number(id))
      .pipe(
        switchMap((empleado) => {
          if (empleado) {
            return this.empleadoService.editar(
              {
                ...empleado,
                estado: 'invalido',
              },
              empleado.id
            );
          } else {
            return [null];
          }
        })
      )
      .subscribe(() => {
        this.showEmpleado();
      });
  }
  showCreateEmpleado() {
    this.showCreate = !this.showCreate;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      identificacion: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      nombre_completo: [
        '',
        [
          Validators.required,
          Validators.pattern("^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
      edad: [
        '',
        [
          Validators.required,
          Validators.min(18),
          Validators.max(80),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      apto: [false, [Validators.requiredTrue]],
      estado: ['valido'],
      password: ['', [Validators.required, Validators.minLength(8)]],
      departamento: ['', [Validators.required]],
    });
  }

  get identificationField() {
    return this.form.get('identificacion');
  }
  get nombre_completoField() {
    return this.form.get('nombre_completo');
  }
  get edadField() {
    return this.form.get('edad');
  }
  get aptoField() {
    return this.form.get('apto');
  }
  get estadoField() {
    return this.form.get('estado');
  }
  get passwordField() {
    return this.form.get('password');
  }
  get departamentoField() {
    return this.form.get('departamento');
  }
}
