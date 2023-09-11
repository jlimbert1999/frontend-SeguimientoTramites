import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../auth/services/loader.service';
import { Router } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { SidenavService } from '../shared/services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SocketService } from '../services/socket.service';
import { NotificationService } from './services/notification.service';
import Swal from 'sweetalert2';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-home-old',
  templateUrl: './home-old.component.html',
  styleUrls: ['./home-old.component.scss']
})
export class HomeOldComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.menu
  loading$ = this.loader.loading$;
  numberMails$ = this.notificationService.number_mails$
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
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet,
    private sidenavService: SidenavService,
    public themeService: ThemeService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.themeService.startTheme()
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection(this.authService.token)
    // this.socketService.listenUserConection().subscribe(users => {
    //   this.socketService.onlineUsers = users
    // })
    // this.socketService.listenMails().subscribe(mail => {
    //   this.bandejaService.Mails = [mail, ...this.bandejaService.Mails]
    //   this.notificationService.showNotificationNewMail(mail.emisor.funcionario)
    // })
    // this.socketService.listenExpel().subscribe(message => {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'USTED HA SIDO EXPULSADO DEL GRUPO DE TRABAJO',
    //     text: message,
    //     confirmButtonText: 'Aceptar'
    //   })
    //   this.logout()
    // })
  }
  editAccount() {
    this.router.navigate(['home/perfil', this.authService.account.id_account])
  }


  logout() {
    this.authService.logout()
    this.socketService.disconnect()
  }




}
