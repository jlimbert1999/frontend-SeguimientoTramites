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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  Menu: any = this.authService.Menu

  loading$ = this.loader.loading$;


  private _mobileQueryListener: () => void;

  ngAfterViewInit() {

  }
  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public authService: AuthService,
    private socketService: SocketService,
    private bandejaService: BandejaService,
    private toastr: ToastrService,
    public loader: LoaderService,
    private router: Router
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
    // this.socketService.expelUser().subscribe(message => {
    //   console.log(message)
    //   this.authService.logout()
    // })
    this.socketService.listenNotifications().subscribe(data => {
      alert(data)
    })
    this.socketService.listenMails().subscribe((mail: any) => {
      this.toastr.info("Nuevo tramite recibido", undefined, {
        positionClass: 'toast-bottom-right',
        timeOut: 5000,
      })
      this.bandejaService.DataMailsIn = [mail, ... this.bandejaService.DataMailsIn]
    })

    // this.socketService.SocketOn_Mails().subscribe((data: any) => {
    //   this.toastr.info(`${data.emisor.funcionario.nombre} envio un tramite`, 'NUEVO TRAMITE RECIBIDO', {
    //     positionClass: 'toast-bottom-right',
    //     timeOut: 5000,
    //   })
    //   this.bandejaService.dataSource = [data, ...this.bandejaService.dataSource]
    // })


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





}
