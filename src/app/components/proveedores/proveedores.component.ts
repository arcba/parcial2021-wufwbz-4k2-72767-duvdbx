import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../../models/proveedor';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  Titulo = 'Proveedores';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Proveedor[] = null;
  RegistrosTotal: number;

  Pagina = 1; // inicia pagina 1

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    //private articulosService: MockArticulosService,
    //private articulosFamiliasService: MockArticulosFamiliasService,
    private proovedoresService: ProveedoresService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      PoveedorId: [0],
      ProveedorRazonSocial: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      ProveedorCodigo: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ],

      ProveedorFecha: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
      //Activo: [true]
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, IdArticulo: 0 });
    this.submitted = false;
    //this.FormRegistro.markAsPristine();  // incluido en el reset
    //this.FormRegistro.markAsUntouched(); // incluido en el reset
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.proovedoresService.get().subscribe((res: any) => {
      this.Items = res;
      //this.RegistrosTotal = res.RegistrosTotal;
    });
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProveedorFecha.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProveedorFecha = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post --- if (this.AccionABMC == "A")
    if (itemCopy.PoveedorId == 0 || itemCopy.PoveedorId == null) {
      itemCopy.PoveedorId = 0;
      this.proovedoresService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
    }
  }

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
