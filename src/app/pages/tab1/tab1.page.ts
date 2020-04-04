import { DataLocalService } from './../../services/data-local.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slidesOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor( private barcodeScanner: BarcodeScanner,
               private dataLocal: DataLocalService ) {}

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);
        if ( !barcodeData.cancelled) {
          this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text );
        }

     }).catch(err => {
         console.log('Error', err);
         // Si estoy en dev forzar a guardar la pagina de google.
         // falla por errores, en web no funciona por falta de Cordova.
         // Ideal para test de funcionalidades
         if (!environment.production) {
           console.log('Production', environment.production);
           //  this.dataLocal.guardarRegistro('QRCode', 'https://google.com.ar' );
           this.dataLocal.guardarRegistro('QRCode', 'geo:40.73151796986687,-74.06087294062502');
         }
     });
  }


}
