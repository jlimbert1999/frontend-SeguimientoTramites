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
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.menu
  loading$ = this.loader.loading$;
  number_mails = this.notificationService.number_mails$
  isDarkTheme = this.themeService.isDarkTheme
  @ViewChild('snav') public sidenav: MatSidenav;

  private _mobileQueryListener: () => void;

  options = [
    {
      "backgroundColor": "#fff",
      "buttonColor": "#ffc107",
      "headingColor": "#673ab7",
      "label": "Deep Purple & Amber",
      "value": "light-theme-a"
    },
    {
      "backgroundColor": "#fff",
      "buttonColor": "#ff4081",
      "headingColor": "#3f51b5",
      "label": "Indigo & Pink",
      "value": "light-theme-b"
    },
    {
      "backgroundColor": "#303030",
      "buttonColor": "#607d8b",
      "headingColor": "#e91e63",
      "label": "Pink & Blue Grey",
      "value": "dark-theme-a"
    },
    {
      "backgroundColor": "#303030",
      "buttonColor": "#4caf50",
      "headingColor": "#9c27b0",
      "label": "Purple & Green",
      "value": "dark-theme-b"
    }
  ]

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
    private sidenavService: SidenavService,
    private themeService: ThemeService
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
    this.socketService.listenMails().subscribe(mail => {
      this.bandejaService.Mails = [mail, ...this.bandejaService.Mails]
      this.notificationService.showNotificationNewMail(mail.emisor.funcionario)
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
  }
  editAccount() {
    this.router.navigate(['home/perfil', this.authService.account.id_account])
  }


  logout() {
    this.authService.logout()
    this.socketService.disconnect()
  }

  openBottomSheet(): void {
    this.bottomSheet.open(PanelNotificationComponent);
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme)
  }

}
