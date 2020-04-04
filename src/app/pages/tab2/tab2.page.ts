import { DataLocalService } from './../../services/data-local.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( public dataLocal: DataLocalService ) {}

  enviarCorreo() {
    this.dataLocal.enviarCorreo();
  }

  abrirRegistro( registro ) {
    console.log ('Registro', registro );
    this.dataLocal.abrirRegistro( registro );
  }

}
