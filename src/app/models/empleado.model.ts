export interface Empleado {
  id: number;
  nombre_completo: string,
	edad: number,
	apto: string
	estado: string,
	password: string,
	departamento: string,
	identificacion: string
}
export interface EditEmpleado extends Omit<Empleado, 'id'> {}
