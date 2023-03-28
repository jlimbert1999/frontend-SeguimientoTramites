import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { Component, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent {
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 800,
    canvasHeight: 300,
    backgroundColor: '#FFFFFF',
    penColor: '#101D6B',
  };
  constructor(private _bottomSheetRef: MatBottomSheetRef<SignatureComponent>) {

  }

  drawComplete(event: MouseEvent | Touch) {

    this._bottomSheetRef.dismiss(this.signaturePad.toDataURL());
  }


}
