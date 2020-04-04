import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Registro } from './../models/registro.model';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor( private storage: Storage,
               private navCtrl: NavController,
               private file: File,
               private emailComposer: EmailComposer,
               private inAppBrowser: InAppBrowser) {
    // read
    this.cargarStorage();
  }

  async cargarStorage() {
    this.registros = (await this.storage.get('registros')) || [];
  }

  async guardarRegistro( format: string, text: string ) {

    await this.cargarStorage();

    const newRegistro = new Registro( format, text);
    this.registros.unshift( newRegistro );
    console.log(this.registros);

    // save
    this.storage.set('registros', this.registros);

    this.abrirRegistro (newRegistro );
  }

  abrirRegistro(registro: Registro) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        this.inAppBrowser.create( registro.text, '_system');
        break;

      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }

  }

  enviarCorreo() {
    console.log('Enviando correo...');
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.registros.forEach( registro => {
      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',', ' ') }\n`;
      arrTemp.push(linea);
    });

    this.crearArchivoFisico( arrTemp.join() );
  }


  /**
   * Crear archivo fisico
   * verifica si eciste el archivo y segun eso lo crea o no.
   * luego llama a escribir los datos en el archivo.
   */
  crearArchivoFisico( text: string) {
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
        .then( existe => {
          console.log('Existe file', existe);
          return this.escribirEnArchivo( text );
        })
        .catch( err => {
          console.log('Archivo no encontrado', err);
          return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
                     .then( creado => {
                       this.escribirEnArchivo( text );
                     })
                     .catch( err2 => {
                        console.log('Archivo No creado');
                     });
        });
  }

  /**
   * Escribe la informacion en el archivo
   * El archivo debe existir
   * retorna una promesa, pero como no me interesa analizar sus casos
   * simplemente lo hago async y espero a su escritura
   */
  async escribirEnArchivo( text: string) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text);
    console.log('Archivo escrito...');

    const archivo = `${this.file.dataDirectory}/registros.csv`;
    const email = {
      to: 'chechepanzer@gmail.com',
      // cc: '',
      // bcc: '',
      attachments: [
        archivo
      ],
      subject: 'Backup Qr',
      body: 'El adjunto tiene los backups del <strong>ScanApp QR</strong>',
      isHtml: true
    };


    this.emailComposer.open(email);
  }

}
