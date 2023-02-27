import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BandejaService } from '../Tramites/services/bandeja.service';
import { SocketService } from '../Tramites/services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../auth/services/loader.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../Tramites/services/notifications.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PanelNotificationComponent } from '../shared/panel-notification/panel-notification.component';
import { BandejaEntradaService } from '../Tramites/services/bandeja-entrada.service';
import { SidenavService } from '../shared/services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.Menu

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
    private notificationService: NotificationsService,
    private bottomSheet: MatBottomSheet,
    private sidenavService: SidenavService
  ) {
    this.startConectGroupware()
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.socketService.listenUserConected().subscribe((users: any) => {
      this.socketService.OnlineUsers = users
    })
    this.socketService.expelUser().subscribe(message => {
      this.logout()
    })
    this.socketService.listenMails().subscribe(mail => {
      this.bandejaService.Mails = [mail, ...this.bandejaService.Mails]
      let toast = this.toastr.info(`${mail.emisor.funcionario.nombre} ${mail.emisor.funcionario.paterno} ${mail.emisor.funcionario.materno} ha enviado un tramite`, "Nuevo tramite recibido", {
        positionClass: 'toast-bottom-right',
        timeOut: 7000,
      })
      // this.notificationService.addNotificationNewMail(mail.emisor.funcionario, this.bandejaService.PaginationMailsIn.total)
    })
    this.socketService.listenNotifications().subscribe((data: any) => {
      this.notificationService.addNotificationEvent(data.message, data.fullname)
    })



  }
  editAccount() {
    this.router.navigate(['home/perfil'])
  }

  startConectGroupware() {
    let user = {
      id_cuenta: this.authService.Account.id_cuenta,
      fullname: this.authService.Account.funcionario.nombre_completo,
      jobtitle: this.authService.Account.funcionario.cargo
    }
    this.socketService.setupSocketConnection(user);
  }

  logout() {
    this.authService.logout()
    this.socketService.disconnect()
  }

  openBottomSheet(): void {
    this.bottomSheet.open(PanelNotificationComponent);
  }





}
