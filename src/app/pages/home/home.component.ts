import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoaderService } from 'src/app/auth/services/loader.service';
import { NotificationService } from 'src/app/home-old/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { ThemeService } from 'src/app/home-old/services/theme.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.menu;
  loading$ = this.loader.loading$;
  numberMails$ = this.notificationService.number_mails$;
  private mailSubscription: Subscription;
  @ViewChild('snav') public sidenav: MatSidenav;

  private _mobileQueryListener: () => void;

  ngAfterViewInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });
    this.sidenav.open();
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public authService: AuthService,
    public socketService: SocketService,
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    private sidenavService: SidenavService,
    public themeService: ThemeService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.themeService.startTheme();
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.socketService.setupSocketConnection(this.authService.token);
  }

  ngOnInit(): void {
    this.socketService.listenUserConection();
    this.socketService.listenMails();
    this.mailSubscription = this.mailSubscription =
      this.socketService.mailSubscription$.subscribe((data) => {
        const toast = this.toastr.info(
          `${data.receptor.fullname} ha enviado un tramite`,
          'Nuevo tramite recibido',
          {
            positionClass: 'toast-bottom-right',
            closeButton: true,
            timeOut: 7000,
          }
        );
        toast.onTap.subscribe((action) => {
          this.router.navigateByUrl('bandejas/entrada');
        });
      });
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
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
    if (this.mailSubscription) this.mailSubscription.unsubscribe();
  }
  editAccount() {
    this.router.navigate(['home/perfil', this.authService.account.id_account]);
  }

  logout() {
    this.authService.logout();
    this.socketService.disconnect();
  }
}
