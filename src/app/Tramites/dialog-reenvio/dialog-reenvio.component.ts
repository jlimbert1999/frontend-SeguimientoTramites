import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { ReplaySubject, Subject } from 'rxjs';
import { UsersMails } from '../models/mail.model';

@Component({
  selector: 'app-dialog-reenvio',
  templateUrl: './dialog-reenvio.component.html',
  styleUrls: ['./dialog-reenvio.component.css']
})
export class DialogReenvioComponent implements OnInit {
  instituciones: any[] = []
  dependencias: any[] = []
  funcionarios: UsersMails[] = []
  receptor: UsersMails
  mail: any
  motivo: string
  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  public UserCtrl: UntypedFormControl = new UntypedFormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('userSelect', { static: true }) userSelect: MatSelect;
  protected _onDestroy2 = new Subject<void>();

  constructor(
    
  ) { }

  ngOnInit(): void {
  }

}
