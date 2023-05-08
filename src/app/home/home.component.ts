import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../auth/services/loader.service';
import { Router } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PanelNotificationComponent } from '../shared/panel-notification/panel-notification.component';
import { BandejaEntradaService } from '../Bandejas/services/bandeja-entrada.service';
import { SidenavService } from '../shared/services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SocketService } from './services/socket.service';
import { NotificationService } from './services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.menu

  loading$ = this.loader.loading$;

  number_mails = this.notificationService.number_mails$
  @ViewChild('snav') public sidenav: MatSidenav;

  private _mobileQueryListener: () => void;

  ngAfterViewInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    })
    this.sidenav.open()

  }
  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public authService: AuthService,
    private socketService: SocketService,
    public bandejaService: BandejaEntradaService,
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet,
    private sidenavService: SidenavService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.socketService.setupSocketConnection(this.authService.token)
  }
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.socketService.listenUserConection().subscribe(users => {
      this.socketService.onlineUsers = users
    })
    this.socketService.listenNotifications().subscribe(data => {
      this.notificationService.addNotificationEvent('admi', 'dsds')
    })
    this.socketService.listenExpel().subscribe(message => {
      Swal.fire({
        icon: 'info',
        title: 'USTED HA SIDO EXPULSADO DEL GRUPO DE TRABAJO',
        text: message,
        confirmButtonText: 'Aceptar'
      })
      this.logout()
    })

    this.socketService.listenMails().subscribe(mail => {
      this.bandejaService.Mails = [mail, ...this.bandejaService.Mails]
      let toast = this.toastr.info(`${mail.emisor.funcionario.nombre} ${mail.emisor.funcionario.paterno} ${mail.emisor.funcionario.materno} ha enviado un tramite`, "Nuevo tramite recibido", {
        positionClass: 'toast-bottom-right',
        timeOut: 8000,
      })
      // this.notificationService.addNotificationNewMail(mail.emisor.funcionario, this.bandejaService.PaginationMailsIn.total)
    })
  }
  editAccount() {
    this.router.navigate(['home/perfil'])
  }


  logout() {
    this.authService.logout()
    this.socketService.disconnect()
  }

  openBottomSheet(): void {
    this.bottomSheet.open(PanelNotificationComponent);
  }





}
