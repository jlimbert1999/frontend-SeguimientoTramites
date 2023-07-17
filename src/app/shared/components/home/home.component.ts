import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from 'src/app/home/services/socket.service';
import { BandejaEntradaService } from 'src/app/Bandejas/services/bandeja-entrada.service';
import { LoaderService } from 'src/app/auth/services/loader.service';
import { NotificationService } from 'src/app/home/services/notification.service';
import { SidenavService } from '../../services/sidenav.service';
import { ThemeService } from 'src/app/home/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public bandejaService: BandejaEntradaService,
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
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
    // this.socketService.setupSocketConnection(this.authService.token)
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
