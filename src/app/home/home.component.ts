import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BandejaService } from '../Tramites/services/bandeja.service';
import { SocketService } from '../Tramites/services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { BandejaEntradaData } from '../Tramites/models/mail.model';
import { Subject } from 'rxjs';
import { LoaderService } from '../auth/services/loader.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../Tramites/services/notifications.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PanelNotificationComponent } from '../shared/panel-notification/panel-notification.component';

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


  private _mobileQueryListener: () => void;

  ngAfterViewInit() {

  }
  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public authService: AuthService,
    private socketService: SocketService,
    public bandejaService: BandejaService,
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router,
    private notificationService: NotificationsService,
    private bottomSheet: MatBottomSheet
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
      this.bandejaService.addMail(mail)
      let toast = this.toastr.info(`ha enviado un tramite`, "Nuevo tramite recibido", {
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
