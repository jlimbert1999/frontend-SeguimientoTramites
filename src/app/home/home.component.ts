import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BandejaService } from '../Tramites/services/bandeja.service';
import { SocketService } from '../Tramites/services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { BandejaEntradaData } from '../Tramites/models/mail.model';
import { Subject } from 'rxjs';
import { LoaderService } from '../auth/services/loader.service';

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
    public loader: LoaderService
  ) {
    this.socketService.setupSocketConnection();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // escuchar ingreso de usuarios
    this.socketService.SocketOn_JoinUser().subscribe((users: any) => {
      this.socketService.Users = users
    })
    this.socketService.SocketOn_Mails().subscribe((data: any) => {
      this.toastr.info(`${data.emisor.funcionario.nombre} envio un tramite`, 'NUEVO TRAMITE RECIBIDO', {
        positionClass: 'toast-bottom-right',
        timeOut: 5000,
      })
      this.bandejaService.dataSource = [data, ...this.bandejaService.dataSource]
    })

    // emitir solicitiud de ingreso recibiendo los users activos como respuesta
    this.socketService.socket.emit('unirse', this.authService.Detalles_Cuenta, (users: any) => {
      this.socketService.Users = users
    })

  }



}
