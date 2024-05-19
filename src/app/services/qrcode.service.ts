import { Injectable } from '@angular/core';
import {
  BarcodeScanner,
  GoogleBarcodeScannerModuleInstallState,
  ScanResult,
} from '@capacitor-mlkit/barcode-scanning';
import { InitService } from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class QrcodeService {
  constructor(public initService: InitService) { }

  async scanQR() {
    await BarcodeScanner.isSupported().then(async (supported) => {
      if (supported.supported) {
        const { camera } = await BarcodeScanner.requestPermissions()
        if (camera == 'granted') {
          if (this.initService.platform.is('android')) {
            await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(
              async (google) => {
                if (google.available) {
                  BarcodeScanner.scan().then((value: ScanResult) => {
                    this.openTask(value.barcodes[0].displayValue)
                  });
                } else {
                  await this.initService.presentLoading()
                  BarcodeScanner.installGoogleBarcodeScannerModule();
                }
              }
            ).catch((err) => {
              console.log('err is ', err)
            })
          } else {
            BarcodeScanner.scan().then((value: ScanResult) => {
              this.openTask(value.barcodes[0].displayValue)
            });
          }
        }
      }
    })

    BarcodeScanner.addListener(
      'googleBarcodeScannerModuleInstallProgress',
      (event) => {
        if (event.state == GoogleBarcodeScannerModuleInstallState.COMPLETED) {
          this.initService.loading.dismiss()
          BarcodeScanner.scan();
        }
      }
    );

    BarcodeScanner.addListener(
      'scanError',
      (event) => {
        this.initService.loading.dismiss()
        console.log('scanError ', event.message)
      }
    );
  }



  openTask(taskID) {
    this.initService.navCtrl.navigateForward([`task-details/${taskID}`])
  }


}
